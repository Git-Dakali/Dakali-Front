import React, {useEffect, useState} from "react";
import { Grid, Box, Table, Button, Flex, Tooltip, Heading } from "@radix-ui/themes";
import { PlusCircledIcon, TrashIcon, Pencil1Icon } from "@radix-ui/react-icons"
import { CategoryService } from "../../api/generated/services/CategoryService"
import { CategoryModal } from "../Category/CategoryModal"
import { ErrorModal } from "../../components/ErrorModal";
import type { CategoryRequest, CategoryResponse } from "../../api/generated";

export const ProductPage: React.FC = () => {

  const [refreshCategories, setRefreshCategories] = useState(false);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryResponse | null>(null);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(()=> {
    CategoryService.categoryGetAll().then(data => {setCategories(data)});
  }, [refreshCategories]);

  const DeleteEvent = (category:CategoryResponse) =>{
    CategoryService.categoryDelete(category).then(()=>{ setRefreshCategories(!refreshCategories); });
  };

  const CreateEvent =  () =>{
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const EditEvent = (category:CategoryResponse) =>{
    setSelectedCategory(category);
    setIsModalOpen(true);
  };
  
  const SaveService = async (categoryRequest: CategoryRequest) => {

      if(categoryRequest.id == 0)
      {
        await CategoryService.categoryCreate(categoryRequest)
        .then(()=>{ setRefreshCategories(!refreshCategories); })
        .catch((error) => 
          { 
            console.log({error});
            setErrorMessage(error.body);
            setErrorOpen(true);
            setRefreshCategories(!refreshCategories);
          });

      }
      else
        await CategoryService.categoryUpdate(categoryRequest).then(()=>{ setRefreshCategories(!refreshCategories); });

    
  };
  return (
    <>
      <Grid columns="1fr 100fr 1fr" gap="1" rows="1fr 10fr 1fr" width="auto" height="100%">
        <Box gridColumn={"span 2"}><Heading size="8">Categoria</Heading></Box>
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
                    <Table.ColumnHeaderCell width={"10%"}>Code</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell width={"70%"}>Name</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell width={"15%"}>Acciones</Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {categories.map(category => {
                    return (
                      <Table.Row key={category.id}>
                        <Table.Cell>{category.id}</Table.Cell>
                        <Table.Cell>{category.code}</Table.Cell>
                        <Table.Cell>{category.name}</Table.Cell>
                        <Table.Cell>
                          <Tooltip content="Editar"><Button onClick={() => { EditEvent(category);}}><Pencil1Icon/></Button></Tooltip>
                          <Tooltip content="Eliminar"><Button onClick={() => { DeleteEvent(category);}} color="red"><TrashIcon/></Button></Tooltip>
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
        <CategoryModal
          key={selectedCategory?.id ?? "new"}  
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          category={selectedCategory}
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
