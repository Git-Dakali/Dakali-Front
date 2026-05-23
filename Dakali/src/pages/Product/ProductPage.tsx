import React, {useEffect, useState} from "react";
import { Grid, Box, Table, Button, Flex, Tooltip, Heading, TextField } from "@radix-ui/themes";
import { ProductService } from "../../api/generated/services/ProductService"
import { ErrorModal } from "../../components/ErrorModal";
import type { ProductRequest, ProductResponse } from "../../api/generated";
import { ProductModal } from "./ProductModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faPencil, faPlusCircle, faPrint, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Pagination } from "../../components/Pagination";
import { ProductPrintModal } from "./ProductPrintModal";

export const ProductPage: React.FC = () => {

  const [refreshProducts, setRefreshProducts] = useState(false);
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductResponse | null>(null);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [filterSearchString, setFilterSearchString] = useState<string>("");
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  const RunFilter = ()=>{
    ProductService.productGetPage({page, countRows: rows, searchString: filterSearchString }).then((data) => {
      setTotalRows(data.count);
      setProducts(data.values);
    });
  };
  
  useEffect(()=> {
      RunFilter()
    }, [page, rows, refreshProducts]);

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
          <Grid rows="auto 1fr" columns="10fr 1fr 2fr" height={"100%"} gap={"2"}>
            <Box>
              <TextField.Root placeholder="Filtro libre" value={filterSearchString} onChange={(e) => setFilterSearchString(e.target.value)}/>
            </Box>
            <Flex justify={"start"}>
              <Button onClick={() => { if(page !== 1) setPage(1); else RunFilter(); }}><FontAwesomeIcon icon={faFilter} /></Button>
            </Flex>
            <Flex justify={"end"}>
              <Tooltip content="Crear"><Button onClick={CreateEvent}><FontAwesomeIcon icon={faPlusCircle} /></Button></Tooltip>
            </Flex>
            <Box gridColumn={"span 3"}>
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
                        <Table.Cell>{product?.model?.code}</Table.Cell>
                        <Table.Cell>{product.name}</Table.Cell>
                        <Table.Cell>
                          <Tooltip content="Editar"><Button onClick={() => { EditEvent(product);}}><FontAwesomeIcon icon={faPencil} /></Button></Tooltip>
                          <Tooltip content="Imprimir"><Button color="blue" onClick={() => { setSelectedProduct(product); setIsPrintModalOpen(true);}}><FontAwesomeIcon icon={faPrint} /></Button></Tooltip>
                          <Tooltip content="Eliminar"><Button onClick={() => { DeleteEvent(product);}} color="red"><FontAwesomeIcon icon={faTrash} /></Button></Tooltip>
                        </Table.Cell>
                      </Table.Row>
                    );
                  })}
                </Table.Body>
              </Table.Root>
              <Pagination currentPage={page} rows={rows} totalRows={totalRows} onChangePage={setPage} onChangeRows={setRows}/>
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
      {isPrintModalOpen && (
        <ProductPrintModal
          key={selectedProduct?.id ?? "new"}  
          open={isPrintModalOpen}
          onOpenChange={setIsPrintModalOpen}
          product={selectedProduct as ProductResponse}
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
