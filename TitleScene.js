class TitleScene extends Phaser.Scene {
    constructor() {
        super("TitleScene");
        this.scoresText = null;
        this.username = "";
        // Firebase stuff
        firebase.initializeApp(firebaseConfig);
        firebase.analytics();
        this.database = firebase.firestore();
        this.scoreTable = this.database.collection('scores')
            .orderBy('score', 'desc')
            .limit(10);
        // HTML stuff
        this.nameInput = null;
        /** @type {HTMLInputElement} */
        this.element = null;
    }

    create() {
        let button = this.add.rectangle(225, 600, 340, 70, 0x00FF00, 0.3);
        button.setInteractive();
        button.on('pointerdown', () => {
            this.scene.start('MainScene', {
                username: this.username
            });
        });
        this.add.text(225, 600, "PLAY!", {
            fontSize: '40px'
        }).setOrigin(0.5);

        // Text for the high score table
        this.scoresText = this.add.text(340, 10, "", {
            fontSize: '25px',
            align: 'right'
        }).setOrigin(1, 0);
        // Run our database query to get scores
        this.getAllScores();

        // Create an input element for username
        this.nameInput = this.add.dom(225, 400, 'input');
        this.nameInput.setScale(2);
        this.element = this.nameInput.node;
    }

    update() {
        this.username = this.element.value;
    }

    async getAllScores() {
        let snap = await this.scoreTable.get();
        snap.forEach(
            (docSnap) => {
                const data = docSnap.data();
                // const name = data.name;
                // const score = data.score;
                const { name, score } = data;
                let scoreString = `${score}`.padStart(5, ' ');
                this.scoresText.text += `${name}: ${scoreString}\n`;
            }
        );
    }
}