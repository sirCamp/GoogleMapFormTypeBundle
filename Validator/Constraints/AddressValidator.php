<?php

namespace Sircamp\GoogleMapFormTypeBundle\Validator\Constraints;

use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;

class AddressValidator extends ConstraintValidator
{
    public function validate($value, Constraint $constraint)
    {

        if (!preg_match('/^[0-9\-\.]+$/', $value['address']['lat'], $matches) || !preg_match('/^[0-9\-\.]+$/', $value['address']['lng'], $matches)) {
             $this->context->addViolation($constraint->message, array('%lat%' => (float)$value['address']['lat'], '%lng%' => (float)$value['address']['lng']));
             return false;
        }
        
        if($value['address']['lat'] > 90 || $value['address']['lat'] < -90 || $value['address']['lng'] > 180 || $value['address']['lng'] < -180)
        {
             $this->context->addViolation($constraint->message, array('%lat%' => (float)$value['address']['lat'], '%lng%' => (float)$value['address']['lng']));
             return false;
        }

    	if ($value['address']['street'] == '' || $value['address']['street'] == null || !ctype_alnum($value['address']['street'])) {
    		 $this->context->addViolation($constraint->message, array('%street%' => $value['address']['street']));
    		 return false;
    	}
    	if($value['address']['city'] == '' || $value['address']['city'] == null || !ctype_alnum($value['address']['city']))
    	{
    		 $this->context->addViolation($constraint->message, array('%city%' => $value['address']['city']));
    		 return false;
    	}

        if(!ctype_alnum($value['address']['postcode'])){
            $this->context->addViolation($constraint->message, array('%postcode%' => $value['address']['postcode']));
            return false;
        }
        return true;
    }
}