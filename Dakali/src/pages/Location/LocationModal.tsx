import React, { useEffect, useMemo, useState } from "react";
import { Dialog, Button, Flex, Text, Box, Select, Grid } from "@radix-ui/themes";
import { ColumnService, HallwayService, LevelService, LocationStateService, type ColumnResponse, type HallwayResponse, type LevelResponse, type LocationRequest, type LocationResponse, type LocationStateResponse } from "../../api/generated";

type LocationModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  location: LocationResponse | null;         
  onSave: (value: LocationRequest) => Promise<void> | void;
};

export const LocationModal: React.FC<LocationModalProps> = ({
  open,
  onOpenChange,
  location,
  onSave,
}) => {

    const [hallways, setHallways] = useState<HallwayResponse[]>([]);
    const [columns, setColumns] = useState<ColumnResponse[]>([]);
    const [levels, setLevels] = useState<LevelResponse[]>([]);
    const [states, setStates] = useState<LocationStateResponse[]>([]);
    
    
    const [selectHallway, setSelectHallway] = useState(location?.hallway.code ?? "");
    const [selectColumn, setSelectColumn] = useState(location?.column.code ?? "");
    const [selectLevel, setSelectLevel] = useState(location?.level.code ?? "");
    const [selectState, setSelectState] = useState(location?.state.code ?? "");

    useEffect(()=>{
        HallwayService.hallwayGetAll().then((data) => { setHallways(data); });
        ColumnService.columnGetAll().then((data) => { setColumns(data); });
        LevelService.levelGetAll().then((data) => { setLevels(data); });
        LocationStateService.locationStateGetAll().then((data) => { setStates(data); });
    }, [])

    const column = useMemo(() => {
        return columns.find(x => x.code === selectColumn) ?? null
    }, [selectColumn, columns]);

    const hallway = useMemo(() => {
        return hallways.find(x => x.code === selectHallway) ?? null
    }, [selectHallway, hallways]);

    const level = useMemo(() => {
        return levels.find(x => x.code === selectLevel) ?? null
    }, [selectLevel, levels]);

    const state = useMemo(() => {
        return states.find(x => x.code === selectState) ?? null
    }, [selectState, states]);

    const handleSubmit = () => {
        onSave({ id: location?.id ?? 0, guid: location?.guid ?? crypto.randomUUID(), searchString: location?.searchString ?? "", column: column as ColumnResponse, hallway: hallway as HallwayResponse, level: level as LevelResponse, state: state as LocationStateResponse });
    };

    const title = state ? "Editar Ubicacion" : "Crear Ubicacion";

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content minWidth="60%" onInteractOutside={(e) => e.preventDefault()}>
        <Dialog.Title>{title}</Dialog.Title>
        <Grid columns="1fr 1fr 1fr 1fr" gap="3" rows="auto 1fr auto" width="auto" height="100%">
            <Box>
                <Text size="2" mb="1" style={{ display: "block" }}>Pasillo</Text>
                <Select.Root value={selectHallway} onValueChange={setSelectHallway}>
                    <Select.Trigger placeholder="Seleccione un Pasillo"/>
                    <Select.Content>
                        {
                        hallways.map((item)=>{
                            return (<Select.Item key={item.code} value={item.code}>{item.code}-{item.name}</Select.Item>)
                        })
                        }
                    </Select.Content>
                </Select.Root>
            </Box>
            <Box>
                <Text size="2" mb="1" style={{ display: "block" }}>Columna</Text>
                <Select.Root value={selectColumn} onValueChange={setSelectColumn}>
                    <Select.Trigger placeholder="Seleccione una Columna"/>
                    <Select.Content>
                        {
                        columns.map((item)=>{
                            return (<Select.Item key={item.code} value={item.code}>{item.code}-{item.name}</Select.Item>)
                        })
                        }
                    </Select.Content>
                </Select.Root>
            </Box>
            <Box>
                <Text size="2" mb="1" style={{ display: "block" }}>Nivel</Text>
                <Select.Root value={selectLevel} onValueChange={setSelectLevel}>
                    <Select.Trigger placeholder="Seleccione un Nivel"/>
                    <Select.Content>
                        {
                        levels.map((item)=>{
                            return (<Select.Item key={item.code} value={item.code}>{item.code}-{item.name}</Select.Item>)
                        })
                        }
                    </Select.Content>
                </Select.Root>
            </Box>
            <Box>
                <Text size="2" mb="1" style={{ display: "block" }}>Estado</Text>
                <Select.Root value={selectState} onValueChange={setSelectState}>
                    <Select.Trigger placeholder="Seleccione un Estado"/>
                    <Select.Content>
                        {
                        states.map((item)=>{
                            return (<Select.Item key={item.code} value={item.code}>{item.code}-{item.name}</Select.Item>)
                        })
                        }
                    </Select.Content>
                </Select.Root>
            </Box>
            <Flex justify="end" gap="2" mt="3" gridColumn={"span 4"}>
                <Dialog.Close><Button color="gray">Cancelar</Button></Dialog.Close>
                <Button onClick={handleSubmit}>Guardar</Button>
            </Flex>
        </Grid>
      </Dialog.Content>
    </Dialog.Root>
  );
};