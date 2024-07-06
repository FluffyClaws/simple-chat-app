import React from "react";
import { View, Text, TouchableOpacity, Modal as RNModal } from "react-native";
import { modalStyles } from "../styles";

interface ModalProps {
  visible: boolean;
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
  children?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  visible,
  title,
  onConfirm,
  onCancel,
  children,
}) => {
  return (
    <RNModal visible={visible} transparent={true} animationType="fade">
      <View style={modalStyles.modalOverlay}>
        <View style={modalStyles.modalContainer}>
          <Text style={modalStyles.modalTitle}>{title}</Text>
          {children}
          <View style={modalStyles.modalButtons}>
            <TouchableOpacity
              style={modalStyles.modalButton}
              onPress={onCancel}
            >
              <Text style={modalStyles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={modalStyles.modalButton}
              onPress={onConfirm}
            >
              <Text style={modalStyles.modalButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </RNModal>
  );
};

export default Modal;
