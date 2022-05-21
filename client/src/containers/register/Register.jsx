import React from 'react'
import './register.scss'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import TextField from '../../components/textField/TextField'
import Button from '../../components/button/Button'

function Register() {
    const initialValues = {
        firstname: '',
        lastname: '',
        email: '',
        password: ''
    }

    // TODO: add validation
    const validationSchema = Yup.object().shape({
        firstname: Yup.string()
            .required('Pole jest wymagane'),
        lastname: Yup.string()
            .required('Pole jest wymagane'),
        email: Yup.string()
            .email("To nie jest email")
            .required('Pole jest wymagane'),
        password: Yup.string()
            .required('Pole jest wymagane')
    })

    const onSubmit = (data) => {
        // TODO: submit to server
        console.log("register submit button pressed")
    }

    return (
        <div className='register-container'>
            <Formik
                initialValues={initialValues}
                onSubmit={onSubmit}
                validationSchema={validationSchema}>
                <Form className='register-form'>
                    <section className='header'>
                        rejestracja
                    </section>
                    {/* firstname */}
                    <TextField
                        name='firstname'
                        className='register-input'
                        placeholder='Imię'
                    />
                    {/* lastname */}
                    <TextField
                        name='lastname'
                        className='register-input'
                        placeholder='Nazwisko'
                    />
                    {/* email */}
                    <TextField
                        autoComplete='username'
                        name='email'
                        className='register-input'
                        placeholder='Email'
                    />
                    {/* password */}
                    <TextField
                        autoComplete='current-password'
                        name='password'
                        className='register-input'
                        placeholder='Hasło'
                        type='password' />
                    {/* submit button */}
                    <Button
                        type='submit'
                        text='Zarejestruj się' />
                </Form>
            </Formik>
        </div>
    )
}

export default Register