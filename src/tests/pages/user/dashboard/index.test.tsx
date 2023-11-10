import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Dashboard from "@/pages/user/dashboard";

afterEach(() => {
  cleanup();
});

describe("Dashboard Component", () => {
  // Test for checking the presence of a specific HTML element with a data-testid attribute
  // test("Check if the component renders without errors", () => {
  //   render(<Dashboard />);
  //   const component = screen.getByTestId("checkInDocument");
  //   expect(component).toBeInTheDocument();
  // });

  // Test for checking the text content of a specific element
  // test("Check the text content of a specific element", () => {
  //   render(<Dashboard />);
  //   const a = 5;
  //   const b = 5;
  //   const result = a * b;
  //   expect(result).toBe(25);
    // const textElement = screen.getByTestId("checkText");
    // expect(textElement).toHaveTextContent("Subscription Name");
    // const subscriptionNameElement = screen.getByText("Hello");
    // expect(subscriptionNameElement).toBeInTheDocument();
  // });
  // You can add more tests here to cover different scenarios and functionalities of the Dashboard component.
});
