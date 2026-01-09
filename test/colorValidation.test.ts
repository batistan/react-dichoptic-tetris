import { HEX_COLOR_REGEX, isValidHexColor } from "../src/utils/colorValidation";

describe("HEX_COLOR_REGEX", () => {
  test("matches valid hex colors without # prefix", () => {
    expect("FF0000".match(HEX_COLOR_REGEX)).toBeTruthy();
    expect("00FF00".match(HEX_COLOR_REGEX)).toBeTruthy();
    expect("0000FF".match(HEX_COLOR_REGEX)).toBeTruthy();
    expect("ABCDEF".match(HEX_COLOR_REGEX)).toBeTruthy();
  });

  test("matches valid hex colors with # prefix", () => {
    expect("#FF0000".match(HEX_COLOR_REGEX)).toBeTruthy();
    expect("#00FF00".match(HEX_COLOR_REGEX)).toBeTruthy();
    expect("#0000FF".match(HEX_COLOR_REGEX)).toBeTruthy();
    expect("#ABCDEF".match(HEX_COLOR_REGEX)).toBeTruthy();
  });

  test("is case insensitive", () => {
    expect("ff0000".match(HEX_COLOR_REGEX)).toBeTruthy();
    expect("FF0000".match(HEX_COLOR_REGEX)).toBeTruthy();
    expect("Ff0000".match(HEX_COLOR_REGEX)).toBeTruthy();
    expect("#aAbBcC".match(HEX_COLOR_REGEX)).toBeTruthy();
  });

  test("does not match invalid lengths", () => {
    expect("FFF".match(HEX_COLOR_REGEX)).toBeFalsy();
    expect("FFFF".match(HEX_COLOR_REGEX)).toBeFalsy();
    expect("FFFFF".match(HEX_COLOR_REGEX)).toBeFalsy();
    expect("FFFFFFF".match(HEX_COLOR_REGEX)).toBeFalsy();
    expect("#FFF".match(HEX_COLOR_REGEX)).toBeFalsy();
    expect("#FFFFFFF".match(HEX_COLOR_REGEX)).toBeFalsy();
  });

  test("does not match invalid characters", () => {
    expect("GGGGGG".match(HEX_COLOR_REGEX)).toBeFalsy();
    expect("ZZZZZZ".match(HEX_COLOR_REGEX)).toBeFalsy();
    expect("12345G".match(HEX_COLOR_REGEX)).toBeFalsy();
    expect("#GGGGGG".match(HEX_COLOR_REGEX)).toBeFalsy();
  });

  test("does not match empty strings", () => {
    expect("".match(HEX_COLOR_REGEX)).toBeFalsy();
    expect("#".match(HEX_COLOR_REGEX)).toBeFalsy();
  });

  test("does not match multiple # symbols", () => {
    expect("##FFFFFF".match(HEX_COLOR_REGEX)).toBeFalsy();
    expect("#FF#FF#FF".match(HEX_COLOR_REGEX)).toBeFalsy();
  });

  test("does not match hex with spaces", () => {
    expect("FF FF FF".match(HEX_COLOR_REGEX)).toBeFalsy();
    expect(" FFFFFF".match(HEX_COLOR_REGEX)).toBeFalsy();
    expect("FFFFFF ".match(HEX_COLOR_REGEX)).toBeFalsy();
  });
});

describe("isValidHexColor", () => {
  describe("valid hex colors", () => {
    test("returns true for valid hex without #", () => {
      expect(isValidHexColor("FF0000")).toBe(true);
      expect(isValidHexColor("00FF00")).toBe(true);
      expect(isValidHexColor("0000FF")).toBe(true);
      expect(isValidHexColor("FFFFFF")).toBe(true);
      expect(isValidHexColor("000000")).toBe(true);
    });

    test("returns true for valid hex with #", () => {
      expect(isValidHexColor("#FF0000")).toBe(true);
      expect(isValidHexColor("#00FF00")).toBe(true);
      expect(isValidHexColor("#0000FF")).toBe(true);
      expect(isValidHexColor("#FFFFFF")).toBe(true);
      expect(isValidHexColor("#000000")).toBe(true);
    });

    test("returns true for mixed case", () => {
      expect(isValidHexColor("aAbBcC")).toBe(true);
      expect(isValidHexColor("#fF00fF")).toBe(true);
      expect(isValidHexColor("DeAdBe")).toBe(true);
    });

    test("returns true for lowercase hex", () => {
      expect(isValidHexColor("ff0000")).toBe(true);
      expect(isValidHexColor("#abcdef")).toBe(true);
    });

    test("returns true for numeric hex values", () => {
      expect(isValidHexColor("123456")).toBe(true);
      expect(isValidHexColor("000000")).toBe(true);
      expect(isValidHexColor("999999")).toBe(true);
    });

    test("returns true for alphanumeric combinations", () => {
      expect(isValidHexColor("A1B2C3")).toBe(true);
      expect(isValidHexColor("#1A2B3C")).toBe(true);
      expect(isValidHexColor("F0F0F0")).toBe(true);
    });
  });

  describe("invalid hex colors", () => {
    test("returns false for wrong length", () => {
      expect(isValidHexColor("FFF")).toBe(false);
      expect(isValidHexColor("FFFF")).toBe(false);
      expect(isValidHexColor("FFFFF")).toBe(false);
      expect(isValidHexColor("FFFFFFF")).toBe(false);
      expect(isValidHexColor("#FFF")).toBe(false);
      expect(isValidHexColor("#FFFFFFF")).toBe(false);
    });

    test("returns false for invalid characters", () => {
      expect(isValidHexColor("GGGGGG")).toBe(false);
      expect(isValidHexColor("ZZZZZZ")).toBe(false);
      expect(isValidHexColor("XYZ123")).toBe(false);
      expect(isValidHexColor("#GGGGGG")).toBe(false);
      expect(isValidHexColor("12345G")).toBe(false);
    });

    test("returns false for empty or whitespace", () => {
      expect(isValidHexColor("")).toBe(false);
      expect(isValidHexColor(" ")).toBe(false);
      expect(isValidHexColor("      ")).toBe(false);
    });

    test("returns false for just #", () => {
      expect(isValidHexColor("#")).toBe(false);
    });

    test("returns false for multiple #", () => {
      expect(isValidHexColor("##FFFFFF")).toBe(false);
      expect(isValidHexColor("#FF#FF#FF")).toBe(false);
    });

    test("returns false for hex with spaces", () => {
      expect(isValidHexColor("FF FF FF")).toBe(false);
      expect(isValidHexColor(" FFFFFF")).toBe(false);
      expect(isValidHexColor("FFFFFF ")).toBe(false);
      expect(isValidHexColor(" FFFFFF ")).toBe(false);
    });

    test("returns false for special characters", () => {
      expect(isValidHexColor("FF-00-00")).toBe(false);
      expect(isValidHexColor("FF_00_00")).toBe(false);
      expect(isValidHexColor("FF.00.00")).toBe(false);
      expect(isValidHexColor("FF:00:00")).toBe(false);
    });

    test("returns false for rgb/rgba format", () => {
      expect(isValidHexColor("rgb(255,0,0)")).toBe(false);
      expect(isValidHexColor("rgba(255,0,0,1)")).toBe(false);
    });

    test("returns false for named colors", () => {
      expect(isValidHexColor("red")).toBe(false);
      expect(isValidHexColor("blue")).toBe(false);
      expect(isValidHexColor("white")).toBe(false);
    });
  });

  describe("edge cases", () => {
    test("handles common hex colors correctly", () => {
      // Common web colors
      expect(isValidHexColor("#FF0000")).toBe(true); // red
      expect(isValidHexColor("#00FF00")).toBe(true); // green
      expect(isValidHexColor("#0000FF")).toBe(true); // blue
      expect(isValidHexColor("#FFFFFF")).toBe(true); // white
      expect(isValidHexColor("#000000")).toBe(true); // black
      expect(isValidHexColor("#808080")).toBe(true); // gray
    });

    test("handles boundary hex values", () => {
      expect(isValidHexColor("000000")).toBe(true); // min value
      expect(isValidHexColor("FFFFFF")).toBe(true); // max value
      expect(isValidHexColor("AAAAAA")).toBe(true); // all same
      expect(isValidHexColor("012345")).toBe(true); // sequential
    });

    test("rejects hex-like but invalid strings", () => {
      expect(isValidHexColor("0x000000")).toBe(false); // 0x prefix
      expect(isValidHexColor("000000h")).toBe(false); // h suffix
      expect(isValidHexColor("U+000000")).toBe(false); // Unicode notation
    });
  });
});
