import React, { useState } from "react";
import { View } from "react-native";
import { ListItem, Icon } from "react-native-elements";
import { map } from "lodash";
import { Modal } from "..";
import { ChangeDisplayNameForm } from "./ChangeDisplayNameForm";
import { ChangeEmailForm } from "./ChangeEmailForm";
import { ChangePasswordForm } from "./ChangePasswordForm";
import { styles } from "./AccountOptions.styles";

export function AccountOptions(props) {
  const { onReload } = props;

  const [showModal, setShowModal] = useState(false);
  const [renderComponent, setRenderComponent] = useState(null);

  const onCloseOpenModal = () => setShowModal((prevState) => !prevState);

  const selectedComponent = (key) => {
    if (key === "displayName") {
      setRenderComponent(
        <ChangeDisplayNameForm onClose={onCloseOpenModal} onReload={onReload} />
      );
    }

    if (key === "email") {
      setRenderComponent(
        <ChangeEmailForm onClose={onCloseOpenModal} onReload={onReload} />
      );
    }

    if (key === "password") {
      setRenderComponent(<ChangePasswordForm onClose={onCloseOpenModal} />);
    }

    // Abrir modal para el componente seleccionado
    onCloseOpenModal();
  };

  const menuOptions = getMenuOptions(selectedComponent);

  return (
    <View style={styles.container}>
      {map(menuOptions, (menu) => (
        <ListItem
          key={menu.title}
          containerStyle={styles.listItem}
          bottomDivider
          onPress={menu.onPress}
          accessibilityRole="button"
          accessibilityLabel={menu.title}
        >
          {/* Ícono izquierdo (más suave) */}
          <Icon
            type={menu.iconType}
            name={menu.iconNameLeft}
            color={menu.iconColorLeft}
            size={22}
            containerStyle={styles.iconLeft}
          />

          <ListItem.Content>
            <ListItem.Title style={styles.title}>{menu.title}</ListItem.Title>
          </ListItem.Content>

          {/* Chevrom a la derecha para indicar acción */}
          <ListItem.Chevron color={menu.iconColorRight} />
        </ListItem>
      ))}

      <Modal show={showModal} close={onCloseOpenModal}>
        {renderComponent}
      </Modal>
    </View>
  );
}

function getMenuOptions(selectedComponent) {
  return [
    {
      title: "Cambiar Nombre y Apellidos",
      iconType: "material-community",
      iconNameLeft: "account-circle",
      iconColorLeft: "#9e9e9e",
      iconNameRight: "chevron-right",
      iconColorRight: "#bdbdbd",
      onPress: () => selectedComponent("displayName"),
    },
    {
      title: "Cambiar Email",
      iconType: "material-community",
      iconNameLeft: "at",
      iconColorLeft: "#9e9e9e",
      iconNameRight: "chevron-right",
      iconColorRight: "#bdbdbd",
      onPress: () => selectedComponent("email"),
    },
    {
      title: "Cambiar contraseña",
      iconType: "material-community",
      iconNameLeft: "lock-reset",
      iconColorLeft: "#9e9e9e",
      iconNameRight: "chevron-right",
      iconColorRight: "#bdbdbd",
      onPress: () => selectedComponent("password"),
    },
  ];
}
