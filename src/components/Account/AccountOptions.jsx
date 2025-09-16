import React, { useState } from "react";
import { View } from "react-native";
import { ListItem, Icon } from "react-native-elements";
import { Modal } from "..";
import { ChangeDisplayNameForm } from "./ChangeDisplayNameForm";
import { ChangeEmailForm } from "./ChangeEmailForm";
import { ChangePasswordForm } from "./ChangePasswordForm";
import { styles } from "./AccountOptions.styles";

export function AccountOptions(props) {
  const { onReload } = props;

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
        return (
          <ChangeDisplayNameForm
            onClose={onCloseModal}
            onReload={onReload}
          />
        );
      case "email":
        return (
          <ChangeEmailForm
            onClose={onCloseModal}
            onReload={onReload}
          />
        );
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
        <ListItem
          key={menu.id}
          containerStyle={styles.listItem}
          bottomDivider
          onPress={menu.onPress}
          accessibilityRole="button"
          accessibilityLabel={menu.title}
        >
          {/* <-- keys en cada hijo directo del ListItem --> */}
          <Icon
            key={`leftIcon-${menu.id}`}
            type={menu.iconType}
            name={menu.iconNameLeft}
            color={menu.iconColorLeft}
            size={22}
            containerStyle={styles.iconLeft}
          />

          <ListItem.Content key={`content-${menu.id}`}>
            <ListItem.Title style={styles.title}>
              {menu.title}
            </ListItem.Title>
          </ListItem.Content>

          <ListItem.Chevron
            key={`chevron-${menu.id}`}
            color={menu.iconColorRight}
            name={menu.iconNameRight}
          />
        </ListItem>
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
      iconType: "material-community",
      iconNameLeft: "account-circle",
      iconColorLeft: "#9e9e9e",
      iconNameRight: "chevron-right",
      iconColorRight: "#bdbdbd",
      onPress: () => selectedComponent("displayName"),
    },
    {
      id: "email",
      title: "Cambiar Email",
      iconType: "material-community",
      iconNameLeft: "at",
      iconColorLeft: "#9e9e9e",
      iconNameRight: "chevron-right",
      iconColorRight: "#bdbdbd",
      onPress: () => selectedComponent("email"),
    },
    {
      id: "password",
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

export default AccountOptions;
