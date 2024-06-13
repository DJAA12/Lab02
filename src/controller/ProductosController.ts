import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Productos } from "../entity/Productos";
import { resolveObjectURL } from "buffer";

class ProductosController{

    static getAll= async(req: Request, res:Response)=>{
      
        
       try {
        //instancia bd
         const repo= AppDataSource.getRepository(Productos);
         //consulta de bd x metodo find
         const listaProductos= await repo.find({where:{estado:true}});

        // valido si trajo datos, sino devuelvo error
         if(listaProductos.length==0){
            return res.status(404).json({message:"No hay datos registrados."})
         }
         return res.status(200).json(listaProductos);
        
       } catch (error) {
        return res.status(400).json({message:"Error al accedder a la base datos."})
      
       }       
    }

    static create= async(req: Request, res:Response)=>{

        const repoProducto= AppDataSource.getRepository(Productos);

        try {

            //destructuring
            const {id,nombre, precio, stock, categoria}= req.body;

            //validr datos
            if(!id){
                return res.status(400).json({message:"Debe indicar un id del producto."})
            }
            if(!nombre){
                return res.status(400).json({message:"Debe indicar el nombre del producto."})
            }
            if(!precio){
                return res.status(400).json({message:"Debe indicar el precio del producto."})
            }
            if(!stock){
                return res.status(400).json({message:"Debe indicar el stock del producto."})
            }
            if(!categoria){
                return res.status(400).json({message:"Debe indicar la categoria del producto."})
            }

            //reglas de negocio

            //valalir si el procudto ya existe
 
            
            let product= await repoProducto.findOne({where:{id}});
            if(product){
                return res.status(400).json({message:"Ese producto ya existe en la base datos."})
            }

            if(stock<=0){
                return res.status(400).json({message:"El stock debe ser mayor a 0."})
            }

            //instanacia del objeto 
            product = new Productos;
           
            product.id= id;
            product.nombre= nombre;
            product.precio=precio;
            product.categoria=categoria;
            product.stock=stock;
            product.estado=true;


           await repoProducto.save(product);  
           
            
        } catch (error) {
            return res.status(400).json({message:"Error al guardar."})
        }
        return res.status(200).json("Producto guardado correctamente.");
    }
    static getOne= async(req: Request, res:Response)=>{

        try {
            const id = parseInt(req.params['id']);

            //validacion de mas, por lo que vimos en clase.
            if(!id){
                return res.status(400).json({message:"Debe indicar el ID"})
            }

            const repo= AppDataSource.getRepository(Productos);

            try {
                const producto= await repo.findOneOrFail({where:{id}});  
                return res.status(200).json(producto);
            } catch (error) {
                return res.status(404).json({message:"El producto con el ID indcado no existe en el base de datos."})
            }
          
        

        } catch (error) {
            return res.status(404).json({message:"El producto con el ID indcado no existe en el base de datos."})
           
        }

    }

    static delete = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params['id']);
    
            if (!id) {
                return res.status(400).json({ message: "Debe indicar el ID del producto." });
            }
    
            const repo = AppDataSource.getRepository(Productos);
    
            let product = await repo.findOne({ where: { id } });
    
            if (!product) {
                return res.status(404).json({ message: "El producto con el ID indicado no existe." });
            }
    
            await repo.remove(product);
    
            return res.status(200).json({ message: "Producto eliminado correctamente." });
        } catch (error) {
            return res.status(500).json({ message: "Error al eliminar el producto.", error });
        }
    }
    
    static update = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params['id']);
            const { nombre, precio, stock, categoria } = req.body;

            if (!id) {
                return res.status(400).json({ message: "Debe indicar el ID del producto." });
            }

            if (!nombre || !precio || !stock || !categoria) {
                return res.status(400).json({ message: "Debe indicar todos los campos del producto (nombre, precio, stock, categoria)." });
            }

            const repo = AppDataSource.getRepository(Productos);

            let product = await repo.findOne({ where: { id, estado: true } });

            if (!product) {
                return res.status(404).json({ message: "El producto con el ID indicado no existe." });
            }

            if (stock <= 0) {
                return res.status(400).json({ message: "El stock debe ser mayor a 0." });
            }

            product.nombre = nombre;
            product.precio = precio;
            product.stock = stock;
            product.categoria = categoria;

            await repo.save(product);

            return res.status(200).json({ message: "Producto actualizado correctamente." });
        } catch (error) {
            return res.status(500).json({ message: "Error al actualizar el producto.", error });
        }
    }
}

export default ProductosController;