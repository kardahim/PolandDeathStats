import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import TextField from '../../components/textField/TextField'
import Button from '../../components/button/Button'
import './login.scss'

function Login() {
    const initialValues = {
        email: '',
        password: ''
    }

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email("To nie jest email")
            .required('Pole jest wymagane'),
        password: Yup.string()
            .required('Pole jest wymagane')
    })

    const onSubmit = (data) => {
        // TODO: submit to server
        console.log("login submit button pressed")
    }


    return (
        <div className='login-container'>
            <Formik
                initialValues={initialValues}
                onSubmit={onSubmit}
                validationSchema={validationSchema}>
                <Form className='login-form'>
                    <section className='header'>
                        login
                    </section>
                    {/* email */}
                    <TextField
                        autoComplete='username'
                        name='email'
                        className='login-input'
                        placeholder='Email'
                    />
                    {/* password */}
                    <TextField
                        autoComplete='current-password'
                        name='password'
                        className='login-input'
                        placeholder='Hasło'
                        type='password' />
                    {/* submit button */}
                    <Button
                        type='submit'
                        text='Zaloguj się' />
                </Form>
            </Formik>
        </div>
    )
}

export default Login