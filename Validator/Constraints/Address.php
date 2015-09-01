<?php

namespace Sircamp\GoogleMapFormTypeBundle\Validator\Constraints;

use Symfony\Component\Validator\Constraint;

/**
 * @Annotation
 */
class Address extends Constraint
{
    public $message = 'One of values for street, city, postcode ("%lat%" or "%lng%" or "%street%" or "%city%" or "%postcode%") is not valid.';
}