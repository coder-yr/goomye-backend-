import { Box, Button, Input, Label } from "@adminjs/design-system";
import { useEffect, useRef, useState } from "react";
const SizeColorStock = (props) => {
  const { record, property } = props;
  const [entries, setEntries] = useState([]);
  const sizeRef = useRef(null);
  const colorRef = useRef(null);
  const colorNameRef = useRef(null);
  const stockRef = useRef(null);
  const addItem = () => {
    if (!sizeRef.current.value.trim()) return;
    if (!colorRef.current.value.trim()) return;
    if (!colorNameRef.current.value.trim()) return;
    if (!stockRef.current.value.trim()) return;
    const updated = [
      ...entries,
      {
        size: `${sizeRef.current.value.trim()}`,
        color: `${colorRef.current.value.trim()}`,
        colorName: `${colorNameRef.current.value.trim()}`,
        stock: `${stockRef.current.value.trim()}`,
      },
    ];
    sizeRef.current.value = "";
    colorRef.current.value = "";
    colorNameRef.current.value = "";
    stockRef.current.value = "";
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
        <Input ref={sizeRef} placeholder="Enter Size" />
        <Input ref={colorRef} placeholder="Enter Color Code" mx="xl" />
        <Input ref={colorNameRef} placeholder="Enter Color Name" />
        <Input
          type="number"
          ref={stockRef}
          placeholder="Enter Value"
          marginLeft="xl"
        />
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
              <strong>{item["size"]}</strong>: {item["colorName"]} :{" "}
              {item["stock"]} Pcs
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

export default SizeColorStock;
