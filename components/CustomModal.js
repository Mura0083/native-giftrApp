import {Modal, View, Text, Pressable, StyleSheet} from 'react-native';

export default function CustomModal({visible, type, message, buttons, onClose}) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={[styles.container, styles[type] || styles.defaultButton]}>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.buttonContainer}>
            {buttons.map((button, index) => (
              <Pressable
                key={index}
                onPress={button.onPress}
                style={[styles.button, styles[button.type] || styles.defaultButton]}
              >
                <Text style={styles.buttonText}>{button.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  container: {
    width: '80%',
    padding: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  error: {
    borderColor: 'red',
    borderWidth: 2,
  },
  success: {
    borderColor: 'green',
    borderWidth: 2,
  },
  message: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  defaultButton: {
    backgroundColor: 'gray',
  },
  errorButton: {
    backgroundColor: 'darkred',
  },
  successButton: {
    backgroundColor: 'darkgreen',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
})