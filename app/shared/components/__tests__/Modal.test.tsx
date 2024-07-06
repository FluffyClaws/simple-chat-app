import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { Text } from "react-native";
import Modal from "../Modal";

describe("Modal", () => {
  it("renders the modal with the correct title and children", () => {
    const title = "Test Modal";
    const children = <Text>This is a test modal</Text>;
    const { getByText } = render(
      <Modal
        visible={true}
        title={title}
        onConfirm={() => {}}
        onCancel={() => {}}
      >
        {children}
      </Modal>
    );

    expect(getByText(title)).toBeTruthy();
    expect(getByText("This is a test modal")).toBeTruthy();
  });

  it("calls onConfirm when the Confirm button is pressed", () => {
    const onConfirm = jest.fn();
    const { getByText } = render(
      <Modal
        visible={true}
        title="Test Modal"
        onConfirm={onConfirm}
        onCancel={() => {}}
      />
    );

    fireEvent.press(getByText("Confirm"));
    expect(onConfirm).toHaveBeenCalled();
  });

  it("calls onCancel when the Cancel button is pressed", () => {
    const onCancel = jest.fn();
    const { getByText } = render(
      <Modal
        visible={true}
        title="Test Modal"
        onConfirm={() => {}}
        onCancel={onCancel}
      />
    );

    fireEvent.press(getByText("Cancel"));
    expect(onCancel).toHaveBeenCalled();
  });
});
