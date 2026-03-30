import { Box, Grid, IconButton, Text, TextField } from "@radix-ui/themes";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { useMemo } from "react";

interface PaginationProps {
  currentPage: number;
  rows: number;
  totalRows: number;
  onChangePage: (page: number) => void;
  onChangeRows: (rows: number) => void;
}

export function Pagination({ currentPage, rows, totalRows, onChangePage, onChangeRows }: PaginationProps) {
    
    const totalPages = useMemo(() => { return totalRows === 0 ? 1 : Math.ceil(totalRows / rows); }, [rows, totalRows]);

  return (
    <Grid columns={"1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr"} style={{marginTop: "10px"}}>
        <Box gridColumn={"span 2"}>
            <Text mb="1" >Filas: </Text>
            <TextField.Root type="number" value={rows} style={{display: "inline-block"}} onChange={(e) => { onChangePage(1); onChangeRows(Number.parseInt(e.target.value))}}/>
        </Box>
        <Box>
        </Box>
        <Box gridColumn={"span 3"} style={{textAlign:"center"}}>
            <IconButton variant="soft" disabled={currentPage === 1} onClick={() => onChangePage(currentPage - 1)}>
                <ChevronLeftIcon />
            </IconButton>
            <Text size="3" weight="medium"> Página {currentPage} de {totalPages} </Text>
            <IconButton variant="soft" disabled={currentPage === totalPages} onClick={() => onChangePage(currentPage + 1)}>
                <ChevronRightIcon />
            </IconButton>
        </Box>
        <Box gridColumn={"span 2"}></Box>
        <Box>
            <Text>Total: {totalRows}</Text>
        </Box>
    </Grid>
  );
}