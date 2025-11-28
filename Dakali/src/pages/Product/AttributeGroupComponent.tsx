import React, { useState, useMemo } from "react";
import { Text, TextField, Box, Grid, Heading } from "@radix-ui/themes";
import type { AttributeGroupResponse, AttributeRequest, AttributeResponse, FieldGroupResponse } from "../../api/generated";

type AttributeGroupComponentProps = {
  attributeGroup: AttributeGroupResponse; 
  fieldGroup: FieldGroupResponse|null;
  onChange: (value: AttributeGroupResponse) => Promise<void> | void;
};

export const AttributeGroupComponent: React.FC<AttributeGroupComponentProps> = ({
  attributeGroup,
  fieldGroup,
  onChange,
}) => {

  const addAttributes = useMemo(()=> {
    const newAttributes: AttributeResponse[] = [];

    if(fieldGroup === null)
      return newAttributes;  

    fieldGroup.fields.forEach((field) => {
        const findAttribute = attributeGroup.attributes.find((a)=> a.field.toUpperCase() === field.name.toUpperCase()) ?? null;

        if(findAttribute === null)
            newAttributes.push({id:0, guid: crypto.randomUUID(), field: field.name, value: "", searchString: "" });
    });

    return newAttributes;
  }, [fieldGroup, attributeGroup]);

  const [attributes, setAttributes] = useState(addAttributes.concat(attributeGroup.attributes));

  const changeValue = (attribute: AttributeResponse, newValue: string) => {
    const newAttributes = attributes.filter(() => true); 
    const findAttribute = newAttributes.find((c)=> c.guid === attribute.guid);

    if(findAttribute)
        findAttribute.value = newValue;

    setAttributes(newAttributes);
    onChange({id: attributeGroup?.id, guid: attributeGroup?.guid, searchString: attributeGroup?.searchString, name: attributeGroup?.name, sortOrder: attributeGroup?.sortOrder, attributes: newAttributes as AttributeRequest[] });
  };


  
  return (
    <Grid columns="1fr" gap="1" rows="auto 1fr" width="100%" style={{marginBottom: "30px"}}>
        <Box><Heading size="4">{attributeGroup?.name}</Heading></Box>
        <Box>
            <Grid columns="1fr 1fr 1fr 1fr" gap="1" rows="1fr" width="100%">
                {attributes.map((a) => {
                    return (
                        <Box>
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