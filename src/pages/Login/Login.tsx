import {
    IonButton,
    IonContent,
    IonInput,
    IonItem,
    IonPage,
    IonTitle,
    IonToolbar,
} from '@ionic/react';

import { useNavigate } from 'react-router-dom';

function Login() {

    const navigate = useNavigate();

    function entrar() {
        navigate('/dashboard');
    }

    return (
        <IonPage>

            <IonToolbar>
                <IonTitle>Logística</IonTitle>
            </IonToolbar>

            <IonContent className="ion-padding">

                <h1>Login</h1>

                <IonItem>
                    <IonInput
                        label="E-mail"
                        labelPlacement="floating"
                        type="email"
                    />
                </IonItem>

                <IonItem>
                    <IonInput
                        label="Senha"
                        labelPlacement="floating"
                        type="password"
                    />
                </IonItem>

                <IonButton
                    expand="block"
                    onClick={entrar}
                >
                    Entrar
                </IonButton>

            </IonContent>

        </IonPage>
    );
}

export default Login;