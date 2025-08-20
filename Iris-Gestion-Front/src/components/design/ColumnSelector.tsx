import { Checkbox, CheckboxGroup, Stack } from "@chakra-ui/react";
import { allColumns, type ColumnKey } from "../../config/columns";

type Props = {
  selectedKeys: ColumnKey[];
  onChange: (keys: ColumnKey[]) => void;
};

const ColumnSelector = ({ selectedKeys, onChange }: Props) => {
  return (
    <CheckboxGroup
      value={selectedKeys}
      onChange={(val: (string | number)[]) => onChange(val as ColumnKey[])}
    >
      <Stack direction="row" flexWrap="wrap" spacing={4}>
        {allColumns.map((col) => (
          <Checkbox key={col.key} value={col.key}>
            {col.label}
          </Checkbox>
        ))}
      </Stack>
    </CheckboxGroup>
  );
};

export default ColumnSelector;
