import {
    IonContent,
    IonPage,
    IonTitle,
    IonToolbar,
} from '@ionic/react';

function Dashboard() {
    return (
        <IonPage>

            <IonToolbar>
                <IonTitle>Dashboard</IonTitle>
            </IonToolbar>

            <IonContent className="ion-padding">

                <h1>Dashboard</h1>

                <p>
                    Sistema de logística funcionando!
                </p>

            </IonContent>

        </IonPage>
    );
}

export default Dashboard;