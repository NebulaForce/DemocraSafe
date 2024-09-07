
import Head from 'next/head';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
import styles from '../../styles/RegisterCandidate.module.css';

export default function RegisterCandidate() {

    return (
        <>
            <Head>
                <title>Candidate Registration</title>
                <meta name="description" content="Register candidates for the current election." />
                <link rel="icon" href="/assets/favicon.ico" />
                <link
                    rel="stylesheet"
                    href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css"
                />
            </Head>
            <div className={styles.mainContainer}>
                <h1 className={styles.title}>Add new candidate</h1>
                <Form className={styles.form}>
                    <FormGroup floating>
                        <Input
                            id="candidateName"
                            name="name"
                            placeholder="Name"
                            type="text"
                        />
                        <Label for="candidateName">
                            Name
                        </Label>
                    </FormGroup>
                    {' '}
                    <FormGroup floating>
                        <Input
                            id="position"
                            name="position"
                            type="select"
                        >
                            <option>
                                President
                            </option>
                            <option>
                                Deputy
                            </option>
                        </Input>
                        <Label for="position">
                            Title or Position
                        </Label>
                    </FormGroup>
                    {' '}
                    <Button>
                        Add
                    </Button>
                </Form>
            </div>
        </>
    );
}
