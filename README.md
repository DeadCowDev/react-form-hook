
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

You can also check the example project repo [here](https://github.com/DeadCowDev/react-form-hook/tree/main/example)
## License

[MIT](https://choosealicense.com/licenses/mit/)

