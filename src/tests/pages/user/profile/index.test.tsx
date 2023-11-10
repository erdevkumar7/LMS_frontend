import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Profile from "@/pages/user/profile";

afterEach(() => {
  cleanup();
});

describe("App Component", () => {
  test("Default Text", () => {
    // render(<Profile />);
    // const text = screen.getByTestId("textcheck");
    // expect(text).toBeInTheDocument();
  });
});

// describe("Profile", () => {
//   it("renders the Profile component", () => {
//     render(<Profile />);
//     const title = screen.getByText("Profile");
//     expect(title).toBeInTheDocument();
//   });

//   it("Should render submit button", async () => {
//     render(<Profile />);

//     // const main = screen.getAllByTestId("step1");
//     // expect(main).toHaveClass("useNameFront");
//     // expect(main).toHaveTextContent("vrr");

//     // expect(screen.queryByTestId("step-1")).toBeInTheDocument();
//   });

//   const button = screen.queryByTestId("button");
//   // expect(button).toBeInTheDocument();
//   test("Button Text", () => {
//     expect(button).toHaveTextContent("Update Profile");
//   });
// });

//check for submit button
// const button = screen.getByRole("Button", { name: "Update Profile" });
// expect(button).toBeInTheDocument();
// expect(button).not.toBeDisabled();

// expect(screen.queryByTestId("iconbtn")).not.toBeInTheDocument();
// expect(screen.findByText('Update Profile')).toBeInTheDocument()
// expect(screen.getByTestId("iconbtn")).toBeInTheDocument()
// const btn = screen.getByRole("button"); // get the button (pressable)
// fireEvent.click(btn); // click it

// Test 1
// test("Profile Rendering", () => {
// render(<Profile />); // Rendering the App
// const button = screen.getByTestId("buttoncheck");
// expect(button).toBeInTheDocument();
// });

// Test 3
// test("Toggling Text", () => {
//   render(<Profile />);
//   const button = screen.getByTestId("buttoncheck");
//   fireEvent.click(button);
//   expect(button).toHaveTextContent("Submitbtn");
// });
