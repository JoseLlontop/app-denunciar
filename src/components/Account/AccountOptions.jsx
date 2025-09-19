import React, { useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { Modal } from "../Shared/Modal";
import { ChangeDisplayNameForm } from "./ChangeDisplayNameForm";
import { ChangeEmailForm } from "./ChangeEmailForm";
import { ChangePasswordForm } from "./ChangePasswordForm";
import { styles } from "./AccountOptions.styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export function AccountOptions({ onReload }) {
  const [showModal, setShowModal] = useState(false);
  const [renderComponent, setRenderComponent] = useState(null);

  const onCloseModal = () => {
    setShowModal(false);
    setRenderComponent(null);
  };

  const selectedComponent = (key) => {
    setShowModal(true);
    setRenderComponent(key);
  };

  const renderSelectedComponent = (key) => {
    switch (key) {
      case "displayName":
        return <ChangeDisplayNameForm onClose={onCloseModal} onReload={onReload} />;
      case "email":
        return <ChangeEmailForm onClose={onCloseModal} onReload={onReload} />;
      case "password":
        return <ChangePasswordForm onClose={onCloseModal} />;
      default:
        return null;
    }
  };

  const menuOptions = getMenuOptions(selectedComponent);

  return (
    <View style={styles.container}>
      {menuOptions.map((menu) => (
        <TouchableOpacity
          key={menu.id}
          style={styles.listItem}
          onPress={menu.onPress}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={menu.title}
        >
          <View style={styles.iconLeft}>
            <MaterialCommunityIcons
              name={menu.iconNameLeft}
              size={22}
              color={menu.iconColorLeft}
            />
          </View>

          <Text style={styles.title}>{menu.title}</Text>

          <MaterialCommunityIcons
            name="chevron-right"
            size={22}
            color={menu.iconColorRight}
          />
        </TouchableOpacity>
      ))}

      <Modal show={showModal} close={onCloseModal}>
        {renderSelectedComponent(renderComponent)}
      </Modal>
    </View>
  );
}

function getMenuOptions(selectedComponent) {
  return [
    {
      id: "displayName",
      title: "Cambiar Nombre y Apellidos",
      iconNameLeft: "account-circle",
      iconColorLeft: "#9e9e9e",
      iconColorRight: "#bdbdbd",
      onPress: () => selectedComponent("displayName"),
    },
    {
      id: "email",
      title: "Cambiar Email",
      iconNameLeft: "at",
      iconColorLeft: "#9e9e9e",
      iconColorRight: "#bdbdbd",
      onPress: () => selectedComponent("email"),
    },
    {
      id: "password",
      title: "Cambiar contraseña",
      iconNameLeft: "lock-reset",
      iconColorLeft: "#9e9e9e",
      iconColorRight: "#bdbdbd",
      onPress: () => selectedComponent("password"),
    },
  ];
}
