import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { trpc } from "../../utils/trpc";
import useLogbookStateStore from "./useLogbookStore";

export default function LogbookAuthComponent() {
  const [jwt, setJwtLocalComponent] = useState("");
  const jwtGlobal = useLogbookStateStore((state) => state.jwt);
  const setJwtGlobal = useLogbookStateStore((state) => state.setJwt);
  const [user, setUser] = useState({ nim: "", password: "" });
  const [errMessage, setErrMessage] = useState("");
  const logbookAuth = trpc.logbook.auth.useMutation();

  useEffect(() => setJwtLocalComponent(jwtGlobal), [jwtGlobal]);

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setUser((v) => ({ ...v, [name]: value }));
  }

  async function handleOnSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const response = await logbookAuth.mutateAsync({ ...user });

    if (response.success) {
      setErrMessage("");
      setJwtGlobal(response.data);
    } else {
      setErrMessage(JSON.stringify(response.data));
    }
  }

  return (
    <form onSubmit={handleOnSubmit}>
      <div className="w-[22rem] md:w-[28rem]">
        <span className="mb-4 block text-center text-2xl font-bold">
          Authentication
        </span>
        <div className="card space-y-5 bg-base-200 p-8 text-base-content shadow-md">
          <div className="form-control w-full">
            <label className="label" htmlFor="nim">
              <span className="label-text font-bold">NIM</span>
            </label>
            <input
              name="nim"
              onChange={handleInputChange}
              id="nim"
              type="text"
              placeholder="NIM"
              className="input-bordered input-secondary input w-full"
            />
          </div>

          <div className="form-control w-full">
            <label className="label" htmlFor="password">
              <span className="label-text font-bold">Password</span>
            </label>
            <input
              name="password"
              onChange={handleInputChange}
              id="password"
              type="password"
              placeholder="Password"
              className="input-bordered input-secondary input w-full"
            />
          </div>

          <button type="submit" className="btn-secondary btn normal-case">
            Submit
          </button>

          {jwt && jwt.length > 0 && (
            <div className="form-control">
              <label className="label" htmlFor="jwt">
                <div className="label-text font-bold">Your token</div>
              </label>
              <textarea
                id="jwt"
                className="textarea-bordered textarea-secondary textarea h-24"
                readOnly={true}
                value={jwt}
              ></textarea>
            </div>
          )}

          {errMessage && errMessage.length > 0 && (
            <div className="rounded-lg bg-error py-2 px-4 text-error-content">
              <p className="font-bold">Error message</p>
              <p>{errMessage}</p>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
