import { Box, Button, Input, Label } from "@adminjs/design-system";
import { useEffect, useRef, useState } from "react";
const KeyValueList = (props) => {
  const { record, property } = props;
  const [entries, setEntries] = useState([]);
  const keyRef = useRef(null);
  const valueRef = useRef(null);
  const addItem = () => {
    if (!keyRef.current.value.trim()) return;
    if (!valueRef.current.value.trim()) return;
    const updated = [
      ...entries,
      {
        key: `${keyRef.current.value.trim()}`,
        value: `${valueRef.current.value.trim()}`,
      },
    ];
    keyRef.current.value = "";
    valueRef.current.value = "";
    setEntries(updated);
    props.record.params[property.name] = updated;
  };

  const removeEntry = (index) => {
    const updated = entries.filter((_, i) => i !== index);
    setEntries(updated);
    props.record.params[property.name] = updated;
  };

  // Load existing data
  useEffect(() => {
    // TODO fix this
    console.log("loading called");
    const value = record.params[property.name] || [];
    setEntries(Array.isArray(value) ? value : []);
  }, [record.params, property.name]);

  return (
    <Box>
      <Label>{property.label}</Label>
      <Box flex alignItems="center" gap="default">
        <Input ref={keyRef} placeholder="Enter Key" />
        <Input ref={valueRef} placeholder="Enter Value" />
        <Button
          marginLeft="xl"
          type="button"
          variant="primary"
          onClick={addItem}
        >
          Add
        </Button>
      </Box>

      <Box mt="lg" marginBottom="xl">
        {entries.map((item, index) => (
          <Box
            key={index}
            flex
            justifyContent="space-between"
            alignItems="center"
            mt="sm"
          >
            <span>
              <strong>{item.key}</strong>: {item.value}
            </span>
            <Button
              size="sm"
              variant="danger"
              onClick={() => removeEntry(index)}
            >
              Remove
            </Button>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default KeyValueList;
