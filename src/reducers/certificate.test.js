import reducer, {
  types,
  initialState,
  registerTemplates,
  selectTemplateTab,
  getActiveTemplateTab,
  getTemplates,
  resetCertificateState
} from "./certificate";

describe("reducers", () => {
  describe("reset certificate", () => {
    it("should reset the state to initial state", () => {
      const prevState = { foo: "bar" };
      expect(reducer(prevState, resetCertificateState())).toStrictEqual(
        initialState
      );
    });
  });
  describe("cERTIFICATE_TEMPLATE_SELECT_TAB", () => {
    it("should update activeTemplateTab", () => {
      const action = {
        type: types.CERTIFICATE_TEMPLATE_SELECT_TAB,
        payload: 2
      };
      const prevState = { foo: "bar" };
      const expectedState = {
        foo: "bar",
        activeTemplateTab: 2
      };
      expect(reducer(prevState, action)).toStrictEqual(expectedState);
    });
  });
  describe("cERTIFICATE_TEMPLATE_REGISTER", () => {
    it("should update templates and activeTemplateTab for new state", () => {
      const action = {
        type: types.CERTIFICATE_TEMPLATE_REGISTER,
        payload: [
          {
            id: "certificate",
            label: "Certificate"
          },
          {
            id: "transcript",
            label: "Transcript"
          }
        ]
      };
      const prevState = { foo: "bar" };
      const expectedState = {
        foo: "bar",
        templates: [
          {
            id: "certificate",
            label: "Certificate"
          },
          {
            id: "transcript",
            label: "Transcript"
          }
        ]
      };
      expect(reducer(prevState, action)).toStrictEqual(expectedState);
    });

    it("should update templates and activeTemplateTab for existing template", () => {
      const action = {
        type: types.CERTIFICATE_TEMPLATE_REGISTER,
        payload: [
          {
            id: "certificate",
            label: "Certificate"
          },
          {
            id: "transcript",
            label: "Transcript"
          }
        ]
      };
      const prevState = {
        foo: "bar",
        templates: [
          {
            id: "transcript",
            label: "Transcript"
          },
          { id: "certificate", label: "Certificate" }
        ],
        activeTemplateTab: 0
      };
      const expectedState = {
        foo: "bar",
        templates: [
          {
            id: "certificate",
            label: "Certificate"
          },
          {
            id: "transcript",
            label: "Transcript"
          }
        ],
        activeTemplateTab: 0
      };
      expect(reducer(prevState, action)).toStrictEqual(expectedState);
    });
  });
});

describe("actions", () => {
  it("registerTemplates should generate correct action", () => {
    const fn = registerTemplates;
    const payload = [
      {
        id: "certificate",
        label: "Certificate"
      },
      {
        id: "transcript",
        label: "Transcript"
      }
    ];
    const expectedAction = {
      type: "CERTIFICATE_TEMPLATE_REGISTER",
      payload: [
        { id: "certificate", label: "Certificate" },
        { id: "transcript", label: "Transcript" }
      ]
    };
    expect(fn(payload)).toStrictEqual(expectedAction);
  });

  it("selectTemplateTab should generate correct action", () => {
    const fn = selectTemplateTab;
    const payload = 2;
    const expectedAction = {
      type: "CERTIFICATE_TEMPLATE_SELECT_TAB",
      payload: 2
    };
    expect(fn(payload)).toStrictEqual(expectedAction);
  });
});

describe("selectors", () => {
  it("getActiveTemplateTab should return activeTemplateTab", () => {
    const store = { certificate: { activeTemplateTab: 2 } };
    expect(getActiveTemplateTab(store)).toStrictEqual(2);
  });

  it("getTemplates should return activeTemplateTab", () => {
    const store = {
      certificate: {
        templates: [
          {
            id: "certificate",
            label: "Certificate"
          },
          {
            id: "transcript",
            label: "Transcript"
          }
        ]
      }
    };
    expect(getTemplates(store)).toStrictEqual([
      {
        id: "certificate",
        label: "Certificate"
      },
      {
        id: "transcript",
        label: "Transcript"
      }
    ]);
  });
});
