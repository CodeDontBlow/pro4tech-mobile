import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "./filter.style";

export type FilterOption = {
  label: string;
  value: string;
};

type FilterProps = {
  options?: FilterOption[];
  defaultValue?: string;
  onChange?: (option: FilterOption) => void;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
};

const DEFAULT_OPTIONS: FilterOption[] = [
  { label: "Todos", value: "all" },
  { label: "30 dias", value: "30d" },
  { label: "7 dias", value: "7d" },
];


const ChevronUp = () => (
  <View style={{ width: 12, height: 8, justifyContent: "center", alignItems: "center" }}>
    <View style={{ width: 8, height: 8, borderLeftWidth: 1.5, borderTopWidth: 1.5, borderColor: "#555", transform: [{ rotate: "45deg" }], marginTop: 3 }} />
  </View>
);

const ChevronDown = () => (
  <View style={{ width: 12, height: 8, justifyContent: "center", alignItems: "center" }}>
    <View style={{ width: 8, height: 8, borderLeftWidth: 1.5, borderBottomWidth: 1.5, borderColor: "#555", transform: [{ rotate: "-45deg" }], marginBottom: 3 }} />
  </View>
);

export function Filter({
  options = DEFAULT_OPTIONS,
  defaultValue = "30d",
  onChange,
  isOpen,
  onToggle,
  onClose,
}: FilterProps) {
  const [selected, setSelected] = useState<FilterOption>(
    options.find((o) => o.value === defaultValue) ?? options[0]
  );

  const handleSelect = (option: FilterOption) => {
    setSelected(option);
    onClose();
    onChange?.(option);
  };

  return (
    <View style={[styles.wrapper, isOpen && { zIndex: 10 }]}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.triggerButton, isOpen && styles.triggerButtonOpen]}
        onPress={onToggle}
      >
       
        <Text style={styles.triggerLabel} numberOfLines={1}>{selected.label}</Text>
        {isOpen ? <ChevronUp /> : <ChevronDown />}
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.dropdown}>
          {options.map((option, index) => {
            const isActive = option.value === selected.value;
            const isLast = index === options.length - 1;
            return (
              <TouchableOpacity
                key={option.value}
                activeOpacity={0.7}
                style={[styles.option, !isLast && styles.optionBorder]}
                onPress={() => handleSelect(option)}
              >
                <Text style={[styles.optionLabel, isActive && styles.optionLabelActive]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}