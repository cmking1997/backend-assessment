'use client'

import { Button, Field, Flex, Input } from "@chakra-ui/react";
import { useState } from "react";
import { searchCardAPI } from "../utils/api";

export default function MainPage() {
  const [cardNumber, setCardNumber] = useState(""); // cardNumber as a string
  const [balance, setBalance] = useState(-1); // balance as a number
  const [isSearching, setIsSearching] = useState(false); // isSearching used to debounce multiple user requests too quickly
  const [isError, setIsError] = useState(false); // isError used to denote if the error message should be displayed to the user

  const handleSearchCardNumber = () => {
    const sanitizedCardNumber = cardNumber.replace(/-/g, '').replace(/ /g, ''); //replace '-' or ' ' in input string as people are likely to include that when typing it out
    if (
      isCardValid(sanitizedCardNumber) // check if number is valid
    ) {
      if (isSearching) return; // if already searching debounce request
      setIsSearching(true); // enable searching flag
      setIsError(false); // reset if an error is shown
      searchCardAPI(sanitizedCardNumber) // initialize search
        .then((response) => {
          const allData = response.data;
          if (allData.balance) { // if the balance is valid set it
            setBalance(allData.balance);
          } else { // otherwise a bad card number was likely searched, display error
            setBalance(-1);
            setIsError(true);
          }
          setIsSearching(false); // reset is searching debounce
        })
        .catch((error) => { // if an error occurs reset balance, show error message, reset debounce
          console.error(error); // log relevent errors to console
          setBalance(-1);
          setIsError(true);
          setIsSearching(false);
        });
    } else { // if number isn't valid reset balance and show error
      setBalance(-1);
      setIsError(true);
    }
  }

  const isCardValid = (sanitizedCardNumber: string) => {
    if (
      sanitizedCardNumber.length === 16 && // card number is valid length
      sanitizedCardNumber.match(/^[0-9a-z]+$/) // card number contains only alphanumeric characters (in a real setting this would likely be only numeric but sample data is alphanumeric)
    ) {
      return true;
    }
    return false;
  };

  return (
    <Flex
      height={'100vh'} // set height to full view height
      backgroundColor={'#222222'} // set background to a medium grey
      flexDirection={'column'} // vertically stack header and main body 
    >
      <Flex
        height={'64px'} // header height
        justifyContent={'center'} // align text horizontally center
        alignItems={'center'} // align text vertically center
      >
        Check Your Card Balance Here
      </Flex>
      <Flex
        height={'100%'} // set body to 100% of remaining parent's height
        justifyContent={'center'} // align content horizontally center
        alignItems={'center'} // align content vertically center
        flexDirection={'column'}
      >
        <Flex
          marginBottom={'16px'}
        >
          {/* Field wrapped used to keep label and error text consistently aligned with input & button */}
          <Field.Root
            invalid={isError} // if isError is true then display the errorText below
            width={'345px'} // define a width so that the error appearing doesn't cause the input to jump left significantly
          >
            <Field.Label>
              Card Number:
            </Field.Label>
            <Flex>
              <Input
                placeholder="Enter Card Number"
                value={cardNumber}
                onChange={(event) => setCardNumber(event.currentTarget.value)}
                width={'200px'}
                marginRight={'8px'}
              ></Input>
              <Button
                onClick={() => handleSearchCardNumber()}
              >
                Check Balance
              </Button>
            </Flex>
            <Field.ErrorText>
              Your card number should be a 16 digit number with no symbols or additional text. Ensure the number on the card matches the number entered.
            </Field.ErrorText>
          </Field.Root>
        </Flex>
        {balance >= 0 && ( // if a balance exists then display it below the card input
          <Flex>
            Card Balance: ${balance}
          </Flex>
        )}
      </Flex>
    </Flex>
  );
}
