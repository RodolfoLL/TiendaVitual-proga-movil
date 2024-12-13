import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProductScreen } from '../screen/ProductScreen/product.screen';
import { ShoppingScreen } from '../screen/ShoppingScreen/ShoppingScreen';
import {  CustomNavigationBarProducts } from '../components/CustomNavigationBarProductos';
import MapComponent from '../components/map.component';

const Stack = createNativeStackNavigator();
export const ShoppingNavigation = () => {
  return (
    <Stack.Navigator
      initialRouteName='Producto'
      screenOptions={{
        header: (props) => <CustomNavigationBarProducts{...props} nextRoute="Carrito" />,
      }}
    >
      <Stack.Screen
        name='Producto'
        component={ProductScreen}
        options={{ headerTitle:"Productos"}}

      />
      <Stack.Screen
        name='Carrito'
        component={ShoppingScreen}
        options={{ headerTitle: 'Carrito de Compras' }}
      />
      <Stack.Screen
        name='Mapa'
        component={MapComponent}
        options={{ headerTitle: 'Mapa' }}
      />
    </Stack.Navigator>
  );
};
