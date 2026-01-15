import React, {useEffect, useState} from "react";
import { Grid, Box, Table, Button, Flex, Tooltip, Heading } from "@radix-ui/themes";
import { PlusCircledIcon, TrashIcon, Pencil1Icon } from "@radix-ui/react-icons"
import { ProductService } from "../../api/generated/services/ProductService"
import { ErrorModal } from "../../components/ErrorModal";
import type { ProductRequest, ProductResponse } from "../../api/generated";
import { ProductModal } from "./ProductModal";

export const ProductPage: React.FC = () => {

  const [refreshProducts, setRefreshProducts] = useState(false);
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductResponse | null>(null);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(()=> {
    ProductService.productGetAll().then(data => {setProducts(data)});
  }, [refreshProducts]);

  const DeleteEvent = (product:ProductResponse) =>{
    ProductService.productDelete(product as ProductRequest).then(()=>{ setRefreshProducts(!refreshProducts); });
  };

  const CreateEvent =  () =>{
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const EditEvent = (product:ProductResponse) =>{
    setSelectedProduct(product);
    setIsModalOpen(true);
  };
  
  const SaveService = async (productRequest: ProductRequest) => {

      if(productRequest.id == 0)
      {
        await ProductService.productCreate(productRequest)
        .then(()=>{ 
          setRefreshProducts(!refreshProducts);
          setIsModalOpen(false); 
        })
        .catch((error) => 
          { 
            console.log({error});
            setErrorMessage(error.body.message);
            setErrorOpen(true);
            setRefreshProducts(!refreshProducts);
          });

      }
      else
        await ProductService.productUpdate(productRequest)
          .then(()=>{ 
            setRefreshProducts(!refreshProducts);
            setIsModalOpen(false);  
          })
          .catch((error) => 
          { 
            console.log({error});
            setErrorMessage(error.body.message);
            setErrorOpen(true);
            setRefreshProducts(!refreshProducts);
          });

    
  };
  return (
    <>
      <Grid columns="1fr 100fr 1fr" gap="1" rows="1fr 10fr 1fr" width="auto" height="100%">
        <Box gridColumn={"span 2"}><Heading size="8">Productos</Heading></Box>
        <Box></Box>
        <Box></Box>
        <Box>
          <Grid rows="auto 1fr" columns="1" height={"100%"} gap={"2"}>
            <Flex justify={"end"}>
              <Tooltip content="Crear"><Button onClick={CreateEvent}><PlusCircledIcon/></Button></Tooltip>
            </Flex>
            <Box>
              <Table.Root variant="surface">
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeaderCell width={"5%"}>Id</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell width={"10%"}>Modelo</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell width={"70%"}>Nombre</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell width={"15%"}>Acciones</Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {products.map(product => {
                    return (
                      <Table.Row key={product.id}>
                        <Table.Cell>{product.id}</Table.Cell>
                        <Table.Cell>{product.model.code}</Table.Cell>
                        <Table.Cell>{product.name}</Table.Cell>
                        <Table.Cell>
                          <Tooltip content="Editar"><Button onClick={() => { EditEvent(product);}}><Pencil1Icon/></Button></Tooltip>
                          <Tooltip content="Eliminar"><Button onClick={() => { DeleteEvent(product);}} color="red"><TrashIcon/></Button></Tooltip>
                        </Table.Cell>
                      </Table.Row>
                    );
                  })}
                </Table.Body>
              </Table.Root>
            </Box>
          </Grid>
          
        </Box>
      </Grid>
      {isModalOpen && (
        <ProductModal
          key={selectedProduct?.id ?? "new"}  
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          product={selectedProduct}
          onSave={SaveService}
        />
      )}
      <ErrorModal
        open={errorOpen}
        onOpenChange={setErrorOpen}
        message={errorMessage}
      />
    </>
    
  );
};
