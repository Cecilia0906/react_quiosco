// import { productos as data } from '../data/productos'
import {  useEffect } from 'react'
import useSWR from 'swr'
import Producto from '../components/Producto'
import clienteAxios from '../config/axios'
//import clienteAxios from  '/http://localhost:5173/config/axios'
import  useQuiosco  from '../hooks/useQuiosco'



export default function Inicio(){


   const { categoriaActual } = useQuiosco()
   //const [categoriaActual, setCategoriaActual] = useState(categorias[0]);

   //Consulta SWR

   const token = localStorage.getItem('AUTH_TOKEN')
   


   const fetcher = () => clienteAxios(token ? '/api/productos' : null,{
      headers: {
         Authorization: `Bearer ${token}`
      }

   }).then(data =>data.data)
 
     
 
   const { data = { data: [] }, error, isLoading } = useSWR('/api/productos', fetcher,{ refreshInterval:1000})
     

 // console.log(data);
  // console.log(error);
 //  console.log(isLoading);


 
   if(isLoading) return 'Cargando'

   if (error) return 'Error al cargar los datos.';
 
   // const productos = data?.data ? data.data.filter(producto => producto.categoria_id === categoriaActual.id) : [];
   //const productos = data.data.filter(producto => producto.categoria_id === categoriaActual.id)
   const productos = data.data.filter(producto => producto.categoria_id === (categoriaActual?.id ?? 1))

 

    return (
    
       <>
         <h1 className="text-4xl font-black">{categoriaActual.nombre}</h1>
         <p className='text-2xl my-10'>
            Elige y personaliza tu pedido a continuación.
         </p>
         <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
         {productos.map(producto => (
            <Producto 
               key={producto.imagen}
               producto={producto}
               botonAgregar={true}
            />

        ))}


         </div>
       
       </>
    )
  } 