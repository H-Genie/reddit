import axios from "axios";
import { createContext, useContext, useReducer, useEffect } from "react";
import { Uesr } from "../types";

interface State {
    authenticated: boolean;
    user: Uesr | undefined;
    loading: boolean;
}

const StateContext = createContext<State>({
    authenticated: false,
    user: undefined,
    loading: true,
});

const DispatchContext = createContext<any>(null);

interface Action {
    type: string;
    payload: any;
}

const reducer = (state: State, { type, payload }: Action) => {
    switch (type) {
        case "LOGIN":
            return {
                ...state,
                authenticated: true,
                user: payload,
            };
        case " LOGOUT":
            return {
                ...state,
                authenticated: false,
                user: null,
            };
        case "STOP_LOADING":
            return {
                ...state,
                loading: false,
            };
        default:
            throw new Error(`Unknown action type ${type}`);
    }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, defaultDispatch] = useReducer(reducer, {
        user: null,
        authenticated: false,
        loading: true,
    });

    const dispatch = (type: string, payload?: any) => {
        defaultDispatch({ type, payload });
    };

    useEffect(() => {
        async function loadUser() {
            try {
                const res = await axios.get("/auth/me");
                dispatch("LOGIN", res.data);
            } catch (err) {
                console.log(err);
            } finally {
                dispatch("STOP_LOADING");
            }
        }
        loadUser();
    }, []);

    return (
        <DispatchContext.Provider value={dispatch}>
            <StateContext.Provider value={state}>{children}</StateContext.Provider>
        </DispatchContext.Provider>
    );
};

export const useAuthState = () => useContext(StateContext);
export const useAuthDispatch = () => useContext(DispatchContext);
