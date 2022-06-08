import React from 'react'
import './register.scss'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import TextField from '../../components/textField/TextField'
import Button from '../../components/button/Button'
// axios
import axios from '../../api/axios';

function Register() {
    let navigate = useNavigate();
    const [emailRegistered, setEmailRegistered] = useState("")

    const initialValues = {
        firstname: '',
        lastname: '',
        email: '',
        password: ''
    }

    useEffect(() => {
        document.title = "Rejestracja"
    }, [])

    const validationSchema = Yup.object().shape({
        firstname: Yup.string()
            .required('Pole jest wymagane')
            .matches(/^[A-ZĄĆĘŁŃÓŚŻŹ][a-ząćęłńóśżź]{2,}$/, "Musi zaczynać się wielką literą i mieć min. 3 znaki"),
        lastname: Yup.string()
            .required('Pole jest wymagane')
            .matches(/^[A-ZĄĆĘŁŃÓŚŻŹ][a-ząćęłńóśżź]{2,}$/, "Musi zaczynać się wielką literą i mieć min. 3 znaki"),
        email: Yup.string()
            .email("To nie jest email")
            .required('Pole jest wymagane'),
        password: Yup.string()
            .required('Pole jest wymagane')
            .matches(/^(?=.*?[A-ZĄĆĘŁŃÓŚŻŹ])(?=.*?[a-ząćęłńóśżź])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/, "Musi zawierać 8 znaków, wielką i małą literę, liczbę oraz znak specjalny")
    })

    const onSubmit = (data) => {
        axios.get(`/users/email/${data.email}`).then((response) => {
            if (response.data !== null) {
                setEmailRegistered("Konto o podanym adresie email już istnieje");
            }
            else {
                axios.post("/users/register", data).then(() => {
                    navigate(`/login`)
                })
            }
        });
    }

    return (
        <div className='register-container'>
            <Formik
                initialValues={initialValues}
                onSubmit={onSubmit}
                validationSchema={validationSchema}>
                <Form className='register-form'
                    onChange={() => setEmailRegistered("")}>
                    <section className='header'>
                        rejestracja
                    </section>
                    {/* firstname */}
                    <div>
                        <span className='email-error'>{emailRegistered}</span>
                    </div>
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