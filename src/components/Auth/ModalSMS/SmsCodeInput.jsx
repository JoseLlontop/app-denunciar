import React from "react";
import { View, TextInput } from 'react-native';
import { styles } from './SmsCodeInput.styles'; // Crearemos este archivo a continuación

export function SmsCodeInput({ onCodeChange }) {
  const [code, setCode] = React.useState(new Array(6).fill(''));
  const inputs = React.useRef([]);

  const handleTextChange = (text, index) => {
    // Si se pega un código de 6 dígitos
    if (text.length === 6 && index === 0) {
      const newCode = text.split('');
      setCode(newCode);
      onCodeChange(text);
      inputs.current[5]?.focus(); // Foco en el último input
      return;
    }

    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
    onCodeChange(newCode.join(''));

    // Mover foco al siguiente input si se ingresó un dígito
    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    // Mover foco al input anterior si se presiona backspace y el campo está vacío
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      {code.map((digit, index) => (
        <View key={index} style={styles.inputContainer}>
          <TextInput
            ref={(el) => (inputs.current[index] = el)}
            style={styles.inputText}
            keyboardType="number-pad"
            maxLength={index === 0 ? 6 : 1} // Permitir pegar en el primer input
            onChangeText={(text) => handleTextChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            value={digit}
            selectTextOnFocus
          />
        </View>
      ))}
    </View>
  );
}