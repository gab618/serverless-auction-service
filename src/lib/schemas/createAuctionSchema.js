const schema = {
  type: "object",
  properties: {
    body: {
      type: "object",
      properties: {
        title: {
          type: "string",
        },
      },
      require: ["title"],
    },
  },
  required: ["body"],
};

export default schema;
