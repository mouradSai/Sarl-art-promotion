import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from './styles.module.css';
import logo from '../../assets/logo.png';

const Login = () => {
    const [data, setData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");

    const handleChange = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = "http://localhost:8080/api/auth";
            const { data: res } = await axios.post(url, data);
            
            // Stockage du token dans le localStorage
            localStorage.setItem("token", res.data.token);
            
            // Stockage du rôle dans le localStorage
            localStorage.setItem("role", res.data.role);
            
            window.location = "/";
        } catch (error) {
            if (
                error.response &&
                error.response.status >= 400 &&
                error.response.status <= 500
            ) {
                setError(error.response.data.message);
            }
        }
    };

    return (
        <div className={styles.login_container}>
            <div className={styles.login_form_container}>
                <div className={styles.left}>
                    <form className={styles.form_container} onSubmit={handleSubmit}>
                        <img src={logo} alt="Logo" className={styles.logo} />

                        <h1 className="titlelog">Connexion a votre compte</h1>
                        <input
                            type="email"
                            placeholder="Email"
                            name="email"
                            onChange={handleChange}
                            value={data.email}
                            required
                            className={styles.input}
                        />
                        <input
                            type="password"
                            placeholder="Mot de passe"
                            name="password"
                            onChange={handleChange}
                            value={data.password}
                            required
                            className={styles.input}
                        />
                        {error && <div className={styles.error_msg}>{error}</div>}
                        <button type="submit" className={styles.red_btn}>
                            Connexion
                        </button>
                    </form>
                </div>
                <div className={styles.right}>
                    <h1>Vous n'avez pas de compte ?</h1>
                    {/* Ajout du logo ici */}
                    <Link to="/signup">
                        <button type="button" className={styles.white_btn}>
                            S'inscrire
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
