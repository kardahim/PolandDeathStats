import React from 'react'
import './textField.scss'
import { Field, ErrorMessage } from 'formik'

function TextField(props) {
    return (
        <div>
            <ErrorMessage name={props.name} component='span' />
            <Field
                autoComplete={props.autoComplete}
                name={props.name}
                className={props.className}
                placeholder={props.placeholder}
                type={props.type} />
        </div>
    )
}

export default TextField