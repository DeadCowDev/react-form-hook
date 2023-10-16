
![Logo](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/th5xamgrr6se0x5ro4g6.png)


# React Form Hook

A model-driven, simple and typesafe approach to forms in React

## Features

- Simple to use
- Typesafe from start to end
- Lightweight
- Support for Zod


## Installation and usage

First install react-form-hook:

```bash
npm i @deadcow-enterprises/react-form-hook
```

then use it in your application

```javascript
import { useForm } from "@deadcow-enterprises/react-form-hook";
import { z } from "zod";

type LoginModel = {
  username: string;
  password: string;
};

function App() {
  const form = useForm<LoginModel>({
    username: {
      value: "",
      validator: z.string().min(1, "Username is required"),
    },
    password: {
      value: "",
      validator: z.string().min(1, "Password is required"),
    },
  });
  const login = (formValue: LoginModel) => {
    // do something with formValue here like send it to the server
    console.log(formValue);
  };
  return (
    <form onSubmit={form.handleSubmit(login)}>
      <label htmlFor="username">
        Username
        <input
          type="text"
          name="username"
          id="username"
          value={form.value.username}
          onChange={(ev) => {
            form.setValue("username", ev.target.value);
          }}
        />
        {form.errors.username?.map((err, i) => (
          <span className="error" key={i}>
            {err}
          </span>
        ))}
      </label>
      <label htmlFor="password">
        Password
        <input
          type="password"
          name="password"
          id="password"
          value={form.value.password}
          onChange={(ev) => {
            form.setValue("password", ev.target.value);
          }}
        />
        {form.errors.username?.map((err, i) => (
          <span className="error" key={i}>
            {err}
          </span>
        ))}
      </label>

      <button>Submit</button>
    </form>
  );
}
```


## Props

Any additional information goes here


## License

[MIT](https://choosealicense.com/licenses/mit/)

