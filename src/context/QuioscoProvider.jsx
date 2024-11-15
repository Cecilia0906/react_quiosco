import { createContext, useState, useEffect } from 'react'
import { toast } from 'react-toastify'
//import { categorias as categoriasDB} from '../data/categorias'
import clienteAxios from '../config/axios'

const QuioscoContext = createContext();

const QuioscoProvider = ({children}) => {

    const [categorias, setCategorias] = useState([]);

    const [tokenExit, setTokenExist] = useState(false);


    const [categoriaActual, setCategoriaActual] = useState({});

    const [modal, setModal] = useState(false);

    const [producto, setProducto] = useState({});

    const [pedido, setPedido] = useState([]);

    const [total, setTotal] = useState(0);

    useEffect(() => {
         // console.log('Agregaste algo al pedido');
         const nuevoTotal = pedido.reduce((total, producto) => (producto.precio * producto.cantidad)
         + total, 0)
         setTotal(nuevoTotal)

  
      },[pedido])

    //setCategoriaActual(1)
    const obtenerCategorias = async() => {

        if(!tokenExit) return;

        try {                    
            const token = localStorage.getItem('AUTH_TOKEN')
            
            const { data } = await clienteAxios('/api/categorias',{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setCategorias(data.data)
           
           // setCategoriaActual(data.data[0])
           
        } catch (error) {
           // console.log(error)
        }

    }  


     useEffect(() => {

        const token = localStorage.getItem('AUTH_TOKEN')
        if(token){
          
            setTokenExist(true); 
          
        }

        if(tokenExit){                      
            obtenerCategorias();
        

            const interval = setInterval(() => {
                obtenerCategorias();
            }, 10000);
       
    
            // Limpiar el intervalo cuando el componente se desmonte
            return () => clearInterval(interval);
        }
      }, [tokenExit]); // El array vacío asegura que se ejecute una vez al montar el componente
    


    const handleClickCategoria = id => {
        const categoria = categorias.filter(categoria => categoria.id == id)[0]
        setCategoriaActual(categoria)
        
    }

    const handleClickModal = () => {
        setModal(!modal)
    }

    const handleSetProducto = producto => {
        setProducto(producto)
    }

    const handleSetToken = tokenExit => {
        //console.log('en handleSetToken',tokenExit );
        setTokenExist(tokenExit)
    }

    

    const handleAgregarPedido = ({categoria_id,  ...producto}) => {
        //Esto le saca los campos categoria_id y imagen al objeto producto
      

       if(pedido.some(pedidoState => pedidoState.id === producto.id)){
       
        const pedidoActualizado = pedido.map(pedidoState => pedidoState.id ===  producto.id
        ? producto : pedidoState)
        setPedido(pedidoActualizado)
       //setCantidad(pedidoActualizado.cantidad);
      // setEdicion(true)
        toast.success('Guardado correctamente');
       } else { 
           setPedido([...pedido, producto]);
           toast.success('Agregado al pedido');
       } 
    }


    const handleEditarCantidad = id => {
       // console.log(id);
        const productoActualizar = pedido.filter(producto => producto.id === id)[0]
        setProducto(productoActualizar);
        setModal(!modal)
    }


    const handleEliminarProductoPedido = id => {
        const pedidoActualizado = pedido.filter(producto => producto.id !== id)
        setPedido(pedidoActualizado);
        toast.success('Eliminado del pedido');
    }

   
    const handleSubmitNuevaOrden = async (logout) => {
        const token = localStorage.getItem('AUTH_TOKEN')
        try {
          const { data } = await clienteAxios.post('/api/pedidos', {
               total,
               productos: pedido.map(producto => {
                  return {
                    id: producto.id,
                    cantidad: producto.cantidad
                  }

                })
 
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }

            })
            toast.success(data.message)
            setTimeout(() => {
                setPedido([]);
            },1000);
            //CERRAR LA SESION DEL USUARIO:
            setTimeout(() => {
                localStorage.removeItem('AUTH_TOKEN');
                logout();
            },3000);

        } catch (error) {
           // console.log(error);
            
        }
    }

  // console.log(categoriaActual);
const handleClickCompletarPedido = async id => {
    const token = localStorage.getItem('AUTH_TOKEN')
   try {
    const { data } = await clienteAxios.put(`/api/pedidos/${id}`, null , {
        headers: {
            Authorization: `Bearer ${token}`
        }

     })

    
   } catch (error) {
   // console.log(error)
   }
}

const handleClickProductoAgotado = async id => {
    const token = localStorage.getItem('AUTH_TOKEN')
   try {
    const { data } = await clienteAxios.put(`/api/productos/${id}`, null , {
        headers: {
            Authorization: `Bearer ${token}`
        }

     })

    
   } catch (error) {
    //console.log(error)
   }
}

    return (
        <QuioscoContext.Provider
         value={{
            categorias,
            categoriaActual,
            handleClickCategoria,
            modal,
            handleClickModal,
            producto,
            handleSetProducto,
            pedido,
            handleAgregarPedido,
            handleEditarCantidad,
            handleEliminarProductoPedido,
            total,
            handleSubmitNuevaOrden,
            handleClickCompletarPedido,
            handleClickProductoAgotado,
            handleSetToken
                       
         }}

        >{children}</QuioscoContext.Provider>

    )
}

export {
    QuioscoProvider
}

export default QuioscoContext
