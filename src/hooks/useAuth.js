import clienteAxios from '../config/axios';
import useSWR from 'swr';
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import  useQuiosco  from '../hooks/useQuiosco'




export const  useAuth = ({ middleware, url }) => {

    const [loading, setLoading] = useState(false);
    const [isUnauthorized, setIsUnauthorized] = useState(false);
    const {handleSetToken} = useQuiosco()
   
          

    const token = localStorage.getItem('AUTH_TOKEN')
    const navigate = useNavigate()
   
    const { data:user, error, mutate } = useSWR('/api/user', async () => { 
        try {
          const response   = await clienteAxios('/api/user',{
            headers: {
                Authorization: `Bearer ${token}`
            }

           });

            setIsUnauthorized(false); // Reinicia el estado si la solicitud es exitosa
            handleSetToken(true);
            return response.data; // Asegura el retorno de los datos correctos
                    
        } catch(error){ 
          //  console.log("Error de API:", error?.response?.status);
           
            if (error?.response?.status === 401) {
                setIsUnauthorized(true); // Marca que el usuario no está autenticado
               
                // El usuario aún no está autenticado
                return null; // Retornamos null o algún valor para indicar que no hay datos de usuario
            }
            handleSetToken(false);
            throw Error(error?.response?.data?.errors)
          }
        });
          

    const login = async (datos, setErrores) => {
        try {
            setLoading(true); // Activamos el mensaje de carga
            const { data } = await clienteAxios.post('/api/login', datos)
            localStorage.setItem('AUTH_TOKEN', data.token)
            setErrores([])
            await mutate('/api/user'); // Fuerza la actualización directa de los datos del usuario
          //  await mutate()
          } catch (error) {
            setErrores(Object.values(error.response.data.errors))
          } finally {        
            setLoading(false); // Desactivamos el mensaje de carga sin importar el resultado
          }

    }

    const registro = async (datos, setErrores) => {
        try {
            setLoading(true); // Activamos el mensaje de carga
            const { data } = await clienteAxios.post('/api/registro', datos)
            localStorage.setItem('AUTH_TOKEN', data.token)
            setErrores([])
          //  await mutate()
            await mutate('/api/user');
          } catch (error) {
            setErrores(Object.values(error.response.data.errors))
          } finally {        
            setLoading(false); // Desactivamos el mensaje de carga sin importar el resultado
          }

    }

    const logout = async () => {
     
         try {
            await clienteAxios.post('/api/logout', null, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
               

            })
            localStorage.removeItem('AUTH_TOKEN');
            handleSetToken(false);
            await mutate(undefined)
         } catch (error) {
            throw Error(error?.response?.data?.errors)
            
         }
    }



    useEffect(() => {

  
        if(middleware === 'guest' &&  url  && user && !user.admin){
          
            navigate(url)
        }
        if(middleware === 'guest' && user  && user.admin){
         
            navigate('/admin')
        }
        if(middleware === 'admin' && user  && !user.admin){

            navigate('/')
        }
       // if(middleware === 'auth' && error){
        if(middleware === 'auth' && isUnauthorized) {
           
            navigate('/auth/login')
        }

   // },[ user, error ])
  //  },[ user, isUnauthorized ])
    },[user, isUnauthorized, error, middleware, url, navigate]);
   // },[user, isUnauthorized, error, url]);
    


    return {
        login,
        registro,
        logout,
        user,
        error,
        loading
    }


}

