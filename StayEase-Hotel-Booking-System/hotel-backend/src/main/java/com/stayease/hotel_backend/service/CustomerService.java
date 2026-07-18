package com.stayease.hotel_backend.service;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.stayease.hotel_backend.dto.auth.LoginRequestDTO;
import com.stayease.hotel_backend.dto.auth.LoginResponseDTO;
import com.stayease.hotel_backend.dto.customer.CustomerRequestDTO;
import com.stayease.hotel_backend.dto.customer.CustomerResponseDTO;
import com.stayease.hotel_backend.entity.Customer;
import com.stayease.hotel_backend.exception.CustomerNotFoundException;
import com.stayease.hotel_backend.exception.EmailAlreadyExistsException;
import com.stayease.hotel_backend.exception.InvalidCredentialsException;
import com.stayease.hotel_backend.repository.CustomerRepository;
import com.stayease.hotel_backend.security.JwtService;

import lombok.RequiredArgsConstructor;

import com.stayease.hotel_backend.enums.Role;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;

    private CustomerResponseDTO mapToResponseDTO(Customer customer) {

        CustomerResponseDTO dto = new CustomerResponseDTO();

        dto.setId(customer.getId());
        dto.setFirstName(customer.getFirstName());
        dto.setLastName(customer.getLastName());
        dto.setEmail(customer.getEmail());
        dto.setPhoneNumber(customer.getPhoneNumber());
        dto.setAddress(customer.getAddress());

        return dto;
    }

    private Customer mapToEntity(CustomerRequestDTO dto) {

        Customer customer = new Customer();

        customer.setFirstName(dto.getFirstName());
        customer.setLastName(dto.getLastName());
        customer.setEmail(dto.getEmail());
        customer.setPhoneNumber(dto.getPhoneNumber());

        customer.setPassword(
                passwordEncoder.encode(dto.getPassword()));

        customer.setRole(Role.CUSTOMER);

        customer.setAddress(dto.getAddress());

        return customer;
    }

    public CustomerResponseDTO saveCustomer(CustomerRequestDTO dto) {

        if (customerRepository.existsByEmail(dto.getEmail())) {
            throw new EmailAlreadyExistsException(dto.getEmail());
        }

        Customer customer = mapToEntity(dto);

        Customer savedCustomer = customerRepository.save(customer);

        return mapToResponseDTO(savedCustomer);
    }

    public List<CustomerResponseDTO> getAllCustomers() {

        return customerRepository.findAll()
                .stream()
                .map(this::mapToResponseDTO)
                .toList();
    }

    public CustomerResponseDTO getCustomerById(Long id) {

        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new CustomerNotFoundException(id));

        return mapToResponseDTO(customer);
    }

    public void deleteCustomer(Long id) {

        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new CustomerNotFoundException(id));

        customerRepository.delete(customer);
    }

    public CustomerResponseDTO updateCustomer(Long id,
            CustomerRequestDTO dto) {

        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new CustomerNotFoundException(id));

        customer.setFirstName(dto.getFirstName());
        customer.setLastName(dto.getLastName());
        customer.setEmail(dto.getEmail());
        customer.setPhoneNumber(dto.getPhoneNumber());
        customer.setPassword(
                passwordEncoder.encode(dto.getPassword()));
        customer.setAddress(dto.getAddress());

        Customer updatedCustomer = customerRepository.save(customer);

        return mapToResponseDTO(updatedCustomer);
    }

    public LoginResponseDTO login(LoginRequestDTO dto) {

        Customer customer = customerRepository.findByEmail(dto.getEmail())
                .orElseThrow(InvalidCredentialsException::new);

        if (!passwordEncoder.matches(dto.getPassword(), customer.getPassword())) {
            throw new InvalidCredentialsException();
        }

        String token = jwtService.generateToken(customer.getEmail());

        return new LoginResponseDTO(
                customer.getId(),
                customer.getFirstName(),
                customer.getLastName(),
                customer.getEmail(),
                customer.getRole(),
                token);
    }

}
