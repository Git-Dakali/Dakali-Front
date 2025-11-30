import React, { useState, useMemo } from "react";
import { Text, TextField, Box, Grid, Heading } from "@radix-ui/themes";
import type { PropertyGroupResponse, PropertyRequest, PropertyResponse, FieldGroupResponse } from "../../api/generated";

type PropertyGroupComponentProps = {
  propertyGroup: PropertyGroupResponse; 
  fieldGroup: FieldGroupResponse|null;
  onChange: (value: PropertyGroupResponse) => Promise<void> | void;
};

export const PropertyGroupComponent: React.FC<PropertyGroupComponentProps> = ({
  propertyGroup,
  fieldGroup,
  onChange,
}) => {

  const addProperties = useMemo(()=> {
    const newProperties: PropertyResponse[] = [];

    if(fieldGroup === null)
      return newProperties;  

    fieldGroup.fields.forEach((field) => {
        const findProperty = propertyGroup.properties.find((a)=> a.field.toUpperCase() === field.name.toUpperCase()) ?? null;

        if(findProperty === null)
            newProperties.push({id:0, guid: crypto.randomUUID(), field: field.name, value: "", searchString: "" });
    });

    return newProperties;
  }, [fieldGroup, propertyGroup]);

  const [properties, setProperties] = useState(addProperties.concat(propertyGroup.properties));

  const changeValue = (property: PropertyResponse, newValue: string) => {
    const newProperties = properties.filter(() => true); 
    const findProperty = newProperties.find((c)=> c.guid === property.guid);

    if(findProperty)
        findProperty.value = newValue;

    setProperties(newProperties);
    onChange({id: propertyGroup?.id, guid: propertyGroup?.guid, searchString: propertyGroup?.searchString, name: propertyGroup?.name, sortOrder: propertyGroup?.sortOrder, properties: newProperties as PropertyRequest[] });
  };


  
  return (
    <Grid columns="1fr" gap="1" rows="auto 1fr" width="100%" style={{marginBottom: "30px"}}>
        <Box><Heading size="4">{propertyGroup?.name}</Heading></Box>
        <Box>
            <Grid columns="1fr 1fr 1fr 1fr" gap="1" rows="1fr" width="100%">
                {properties.map((a) => {
                    return (
                        <Box key={a.guid}>
                            <Text size="2" mb="1" style={{ display: "block" }}>{a.field}</Text>
                            <TextField.Root value={a.value} onChange={(e) => changeValue(a, e.target.value)}/>
                        </Box>
                    );
                })}
            </Grid>
        </Box>
    </Grid>
  );
};