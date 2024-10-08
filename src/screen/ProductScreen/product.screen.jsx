import debounce from 'lodash/debounce';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { ActivityIndicator, MD2Colors, Searchbar } from 'react-native-paper';
import { CardComponent } from '../../components/card.component';
import { CategoryChipComponent } from '../../components/categoryChip.component';
import { DialogComponent } from '../../components/dialog.component';
import { filterItem } from '../../services/filterFunction';
import {
	getAllProducts,
	getNameCategory,
	getPopularProducts,
	getProductAtributeId,
	getProductId,
	getProductsBySearch
} from '../../services/api.services';
import { useCategory, useProduct } from '../../Stores/global.store';
import { styles } from '../../styles/globalStyle';

export const ProductScreen = () => {
	// usamos los stores globales para guardar la data enviada desde el backend
	const categorys = useCategory((state) => state.categorys);
	const productsCategory = useProduct((state) => state.productsCategory);
	const productAtribute = useProduct((state) => state.productAtribute);
	const productSearchBar = useProduct((state) => state.productSearchBar);
	const resetProductSearch = useProduct((state) => state.resetProductSearch);
	const productSelected = useProduct((state) => state.productSelected);

	const [idCategory, setidCategory] = useState(0);
	const [visible, setVisible] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const [detailsProduct, setdetailsProduct] = useState({});
	console.log('mis productos seleccionados: ', productSelected);
	const handleSearch = (searchQuery) => {
		if (searchQuery.trim() === '') {
			resetProductSearch();
			return;
		}
		getProductsBySearch(searchQuery);
	};
	const debouncedSearch = useCallback(
		debounce((query) => handleSearch(query), 500),
		[]
	);
	const onChangeSearch = (query) => {
		// resetProductCategory();
		setSearchQuery(query);
		debouncedSearch(query);
	};
	const filterProductName = (nameProduct) => {
		const myProduct = filterItem(
			productAtribute,
			nameProduct,
			'nombre_producto'
		);
		myProduct ? setdetailsProduct(myProduct) : null;
	};
	
	const filterCategory = async (nameCategory) => {
        resetProductSearch();
        if (nameCategory === 'Todos') {
            await getAllProducts();
        }else if (nameCategory === 'Popular') {
            await getPopularProducts();
        } else {
            const myCategory = filterItem(categorys, nameCategory, 'nombre_categoria');
            myCategory ? setidCategory(myCategory.categoria_id) : null;
        }
    };
	useEffect(() => {
		getProductAtributeId();
	}, []);
	useEffect(() => {
		getNameCategory();
	}, []);
	useEffect(() => {
		if(idCategory == -1){ //Solicitar productos sin filtrado
			getAllProducts();
		}else{
			getProductId(idCategory);
		}
	}, [idCategory]);

	const showDialog = (Nombre) => {
		setVisible(true);
		filterProductName(Nombre);
	};
	const hideDialog = () => setVisible(false);

	const item = ({ item }) => {
		return <CardComponent item={item} showDialog={showDialog} />;
	};

	return (
		<View>
			<View style={styles.searchBar}>
				<Searchbar
					placeholder='busca un producto'
					onChangeText={onChangeSearch}
					value={searchQuery}
				/>
			</View>
			<View style={styles.filterChip}>
				{categorys.length == 0 ? (
					<ActivityIndicator
						animating={true}
						color={MD2Colors.deepPurpleA100}
					/>
				) : (
					<CategoryChipComponent filterCategory={filterCategory} />
				)}
			</View>
			<View style={styles.scrollCard}>
				{productSearchBar.length > 0 ? (
					<FlatList
						data={productSearchBar}
						renderItem={item}
						KeyExtractor={(item) => item.id}
					/>
				) : (
					<FlatList
						data={productsCategory}
						renderItem={item}
						KeyExtractor={(item) => item.id}
					/>
				)}
			</View>
			{visible ? (
				<DialogComponent
					visible={visible}
					hideDialog={hideDialog}
					detailProduct={detailsProduct}
				/>
			) : null}
		</View>
	);
};
