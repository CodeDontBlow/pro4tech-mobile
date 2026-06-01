import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import { styles } from "./filter.style";

export type FilterOption = {
  label: string;
  value: string;
};

type FilterProps = {
  options?: FilterOption[];
  defaultValue?: string;
  onChange?: (option: FilterOption) => void;
};

const DEFAULT_OPTIONS: FilterOption[] = [
  { label: "Todos", value: "all" },
  { label: "30 dias", value: "30d" },
  { label: "7 dias", value: "7d" },
];

// Minimal funnel icon drawn with basic shapes
const FunnelIcon = () => (
  <View style={{ width: 14, height: 14, justifyContent: "center", alignItems: "center" }}>
    {/* Top bar */}
    <View style={{ width: 14, height: 2, backgroundColor: "#555", borderRadius: 1, marginBottom: 2 }} />
    {/* Middle bar */}
    <View style={{ width: 9, height: 2, backgroundColor: "#555", borderRadius: 1, marginBottom: 2 }} />
    {/* Bottom bar */}
    <View style={{ width: 4, height: 2, backgroundColor: "#555", borderRadius: 1 }} />
  </View>
);

const ChevronUp = () => (
  <View style={{ width: 12, height: 8, justifyContent: "center", alignItems: "center" }}>
    <View
      style={{
        width: 8,
        height: 8,
        borderLeftWidth: 1.5,
        borderTopWidth: 1.5,
        borderColor: "#555",
        transform: [{ rotate: "45deg" }],
        marginTop: 3,
      }}
    />
  </View>
);

const ChevronDown = () => (
  <View style={{ width: 12, height: 8, justifyContent: "center", alignItems: "center" }}>
    <View
      style={{
        width: 8,
        height: 8,
        borderLeftWidth: 1.5,
        borderBottomWidth: 1.5,
        borderColor: "#555",
        transform: [{ rotate: "-45deg" }],
        marginBottom: 3,
      }}
    />
  </View>
);

export function Filter({
  options = DEFAULT_OPTIONS,
  defaultValue = "30d",
  onChange,
}: FilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<FilterOption>(
    options.find((o) => o.value === defaultValue) ?? options[0]
  );

  const handleSelect = (option: FilterOption) => {
    setSelected(option);
    setIsOpen(false);
    onChange?.(option);
  };

  return (
    <View style={styles.wrapper}>
      {/* Trigger button */}
      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.triggerButton, isOpen && styles.triggerButtonOpen]}
        onPress={() => setIsOpen((prev) => !prev)}
      >
        <FunnelIcon />
        <Text style={styles.triggerLabel}>{selected.label}</Text>
        <View style={styles.chevron}>
          {isOpen ? <ChevronUp /> : <ChevronDown />}
        </View>
      </TouchableOpacity>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop to close on outside tap */}
          <Pressable
            style={{
              position: "absolute",
              top: -9999,
              left: -9999,
              right: -9999,
              bottom: -9999,
              zIndex: 998,
            }}
            onPress={() => setIsOpen(false)}
          />

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
                  <Text
                    style={[
                      styles.optionLabel,
                      isActive && styles.optionLabelActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </>
      )}
    </View>
  );
}