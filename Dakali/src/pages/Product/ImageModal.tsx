import React, { useState, useRef } from "react";
import { Dialog, Button, Flex, Box, Grid, Checkbox, Tooltip, Table } from "@radix-ui/themes";
import type { ImageRequest, ImageResponse } from "../../api/generated";
import { TrashIcon, FilePlusIcon } from "@radix-ui/react-icons";

type ImageModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imagesColor: ImageResponse[]; 
  onSave: (values: ImageRequest[]) => Promise<void> | void;
};

export const ImageModal: React.FC<ImageModalProps> = ({
  open,
  onOpenChange,
  imagesColor,
  onSave,
}) => {
  const [images, setImages] = useState(imagesColor);

  
  const inputRef = useRef<HTMLInputElement | null>(null);
  
  const handleSubmit = () => {
    onSave(images as ImageRequest[]);
    onOpenChange(false);
  };

  const changeIsPrimaryImageEvent = (image: ImageResponse) => {
    image.isPrimary = !image.isPrimary;

    setImages(images.filter(()=> true));
  };

  const deleteImageEvent = (image: ImageResponse) => {
    setImages(images.filter(x => x.guid !== image.guid));
  };

  const SelecteFilesEvent = () => {
    if (inputRef.current) 
      inputRef.current.value = "";
    inputRef.current?.click();
  };

  const selectedImagesEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newImages = images.filter(() => true);
    const fileList = e.target.files;
    if (!fileList) return;

    const selectedFiles = Array.from(fileList);
    const newImagesPromise = selectedFiles.reduce((primiseImages, file) => {
        const existImage = newImages.some(x => x.file.fileName.toUpperCase() === file.name.toUpperCase());

        if(!existImage)
        {
          const myPromise = fileToBase64(file)
            .then(fileBase64 => {
                return {
                  id: 0, 
                  guid: crypto.randomUUID(), 
                  isPrimary: false, 
                  sortOrder: 0, 
                  searchString: "",
                  file: {
                    id: 0, 
                    guid: crypto.randomUUID(), 
                    module: "", 
                    fileName: file.name, 
                    searchString: "",
                    contentBase64: fileBase64
                  }
                } as ImageResponse;
            });

            primiseImages.push(myPromise);
        }

        return primiseImages;
    }, [] as Promise<ImageResponse>[]);

    Promise.all(newImagesPromise).then(values => {
      values.forEach(value => {newImages.push(value);});
      setImages(newImages);
    });
    
  };

  const fileToBase64 = (file: File): Promise<string> =>   {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result as string);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(file);
    });
  }
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content minWidth="70%" onInteractOutside={(e) => e.preventDefault()}>
        <Dialog.Title>Imagenes</Dialog.Title>
        <Box>
          <Grid columns="1fr" gap="3" width="100%">
            <Flex justify={"end"}>
                <input ref={inputRef} type="file" accept="image/*" multiple={true} style={{ display: "none" }} onChange={selectedImagesEvent}/>
                <Tooltip content="Seleccionar Imagenes"><Button onClick={SelecteFilesEvent}><FilePlusIcon/></Button></Tooltip>
            </Flex>
            <Box>
                <Table.Root variant="surface" size={"1"}>
                    <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeaderCell width={"55%"}>Nombre Archivo</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell width={"15%"}>Principal</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell width={"15%"}>Imagen</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell width={"15%"}>Acciones</Table.ColumnHeaderCell>
                    </Table.Row>
                    </Table.Header>
                    <Table.Body>
                    {images.map(image => {
                        return (
                        <Table.Row key={image.file.fileName}>
                            <Table.Cell>{image.file.fileName}</Table.Cell>
                            <Table.Cell><Checkbox defaultChecked checked={image.isPrimary} onCheckedChange={() => changeIsPrimaryImageEvent(image)} /></Table.Cell>
                            <Table.Cell><img src={image.file.contentBase64} alt={image.file.fileName} style={{ height: "45px" }}/></Table.Cell>
                            <Table.Cell><Tooltip content="Eliminar"><Button onClick={() => { deleteImageEvent(image);}} color="red"><TrashIcon/></Button></Tooltip></Table.Cell>
                        </Table.Row>
                        );
                    })}
                    </Table.Body>
                </Table.Root>
            </Box>
            <Flex justify="end" gap="2" mt="3">
              <Dialog.Close><Button color="gray">Cancelar</Button></Dialog.Close>
              <Button onClick={handleSubmit}>Guardar</Button>
            </Flex>
          </Grid>
        </Box>
        
      </Dialog.Content>
    </Dialog.Root>
  );
};