<?php
      require 'vendor/autoload.php';

      // from the form
      $name = trim(strip_tags($_POST['name']));
      $email = trim(strip_tags($_POST['email']));
      $message = htmlentities($_POST['message']);

      $mail = new PHPMailer;

      $mail->isSMTP();                                      // Set mailer to use SMTP
      $mail->Host = 'rugys.serveriai.lt';                   // Specify main and backup SMTP servers
      $mail->SMTPAuth = true;                               // Enable SMTP authentication
      $mail->Username = 'smtp@dopamineux.com';              // SMTP username
      $mail->Password = 'PrymenesisSenaprusiai';                           // SMTP password
      $mail->SMTPSecure = 'ssl';                            // Enable TLS encryption, `ssl` also accepted
      $mail->Port = 465;                                    // TCP port to connect to

      $mail->setFrom('hi@dopamineux.com', 'Dopamine UX');
      $mail->addReplyTo('hi@dopamineux.com', 'Dopamine UX');
      $mail->addAddress('peter@dopamineux.com');               // Name is optional

      $mail->isHTML(true);                                  // Set email format to HTML

      $mail->Subject = 'New inquiry from dopamineux.com';
      $mail->Body    = "<p>Sender: $name ($email)</p><p>$message</p>";
      $mail->AltBody = "Sender: $name ($email) | $message";

      header('Content-type: application/json');

      if (!isset($message) || $message == '') {

            $file = 'spam.txt';
            // Open the file to get existing content
            $current = file_get_contents($file);
            // Append a new person to the file
            $current .=  $name . " | " . $email . " | ". $message . "\n";
            // Write the contents back to the file
            file_put_contents($file, $current);      

            echo json_encode(array (
	            'success' => false,
	        ));

      } else {
      	
      	if (!$mail->send()) {
      		echo json_encode(array (
      			'success' => false,
      			'message' => $mail->ErrorInfo
      			));
      	} else {
      		echo json_encode(array (
      			'success' => true
      			));
      	}
      }

?>
