# GoogleMapFormTypeBundle

Set latitude, longitude, street, postcode and city values on a form using Google Maps. 
The map allows you to search the place by a data that you have filled or by  current location button. 
When a pin is placed or dragged on the map, the latitude longitude fields are updated.

Installation
------------

This bundle is compatible with *Symfony >= 2.1*. Add the following to your `composer.json`:
```php
    "sircamp/google-map-form-type-bundle": "dev-master"
```
Register the bundle in your `app/AppKernel.php` by adding this line in the bundles array:

```php

    new Sircamp\GoogleMapFormTypeBundle\SircampGoogleMapFormTypeBundle(),

```
Remember to add the bundle on **assetic** field present in your configuration file ( config.yalm or others )

Add OhGoogleMapFormTypeBundle to assetic
```yaml
# app/config/config.yml
# Assetic Configuration
assetic:
    bundles:        [ 'SircampGoogleMapFormTypeBundle' ]
```

Usage
------------

This bundle contains a new FormType called GoogleMapType which can be used in your forms like so:
```php
    $builder->add('address', 'sircamp_google_maps');
```
On your model you will have to process the latitude, longitude, street, city, postcode array
```php
    
    use Symfony\Component\Validator\Constraints as Assert;
    use Sircamp\GoogleMapFormTypeBundle\Validator\Constraints as OhAssert;

    class MyEntity
    {
        // ... include your latitude,longitude,street,city,postacode fields here

   /**
    * @Assert\NotBlank()
    * @SircampAssert\Address()
    */
    public function getAddress()
    {
       return array('address' => array(
       'lat' => $this->latitude,
       'lng' => $this->longitude, 
       'street' => $this->street,
       'city' => $this->city, 
       'postcode'=>$this->postcode));
    }

    public function setAddress($address)
    {
       // die(var_dump($address,$address['address']['lat']));
       $this
          ->setCity($address['address']['city'])
          ->setPostcode($address['address']['postcode'])
          ->setStreet($address['address']['street'])
          ->setLatitude($address['address']['lat'])
          ->setLongitude($address['address']['lng']);
       
       return $this;
    }

  }

Include the twig template on your config.yalm for the layout. 
```yaml
    # your config.yml
    twig:
        form:
            resources:
                # This uses the default - you can put your own one here
                - 'SircampGoogleMapFormTypeBundle:Form:fields.html.twig'
```
If you are intending to override some of the elements in the template then you can do so by extending the default `google_maps.html.twig`. This example adds a callback to the javascript when a new map position is selected.

Credits
-------
This librabry is based on the orignal made by 
* Ollie Harridge (ollietb)
