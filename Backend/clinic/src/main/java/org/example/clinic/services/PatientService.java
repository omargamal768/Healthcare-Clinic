package org.example.clinic.services;
import org.example.clinic.dto.PatientDTO;
import org.example.clinic.model.Patient;
import org.example.clinic.repo.PatientRepository;
import org.example.clinic.utils.PatientMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PatientService {

//Dependency Injection
    private final PatientRepository patientRepository;
    @Autowired
    public PatientService(PatientRepository patientRepository) {this.patientRepository = patientRepository;}
//******************************************************************************************************

//Method return list of all patients

public Page<PatientDTO> getAllPatients(Pageable pageable) {
    return patientRepository.findAll(pageable)
            .map(PatientMapper::toDTO);
}
//***********************************************************************************************************

//Method save new patient or update by id
public Patient saveOrUpdatePatient(Patient patient) {
    if (patient.getId() == null || patient.getId() == 0) {
        // Creating a new patient - Check if mobile already exists
        if (patientRepository.existsByMobile(patient.getMobile())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "❌ A patient with mobile " + patient.getMobile() + " already exists.");}
        return patientRepository.save(patient);}
    else {// Updating an existing patient
        Optional<Patient> existingPatientOpt = patientRepository.findById(patient.getId());
        if (existingPatientOpt.isPresent()) {Patient existingPatient = existingPatientOpt.get();
            // Prevent duplicate mobile number update
            if (!existingPatient.getMobile().equals(patient.getMobile()) && patientRepository.existsByMobile(patient.getMobile())) {
                throw new ResponseStatusException(HttpStatus.CONFLICT,
                        "❌ A patient with mobile " + patient.getMobile() + " already exists.");}
            // Update fields
            existingPatient.setName(patient.getName());
            existingPatient.setMobile(patient.getMobile());
            return patientRepository.save(existingPatient);}
        else {throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "❌ Patient not found with ID " + patient.getId());}}}
//*********************************************************************************************************************

//Method find patient by his id
public PatientDTO findById(Long id) {
    Patient patient = patientRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "❌ Patient not found with ID " + id));
    return PatientMapper.toDTO(patient);}

//  *******************************************************************************************************

//Method to delete a patient by ID
    public void deleteById(Long id) {
    if (!patientRepository.existsById(id)) {throw new ResponseStatusException(HttpStatus.NOT_FOUND,
            "❌ Patient not found with ID " + id);}
    patientRepository.deleteById(id);}
//*********************************************************************************************************************

//Method to return patient object by his mobile
public PatientDTO getPatientByMobile(String mobile) {
    Patient patient = patientRepository.findByMobileContaining(mobile)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "❌ Patient not found with mobile " + mobile));
    return PatientMapper.toDTO(patient);}
//*********************************************************************************************************************
//Method to return patient object by his name
public List<PatientDTO> getPatientsByName(String name) {
    List<Patient> patients = patientRepository.findByNameContaining(name);
    if (patients.isEmpty()) {
        throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                "❌ No patients found with name containing: " + name);
    }
    return patients.stream()
            .map(PatientMapper::toDTO)
            .collect(Collectors.toList());
}


}