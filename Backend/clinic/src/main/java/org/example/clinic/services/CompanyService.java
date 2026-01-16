package org.example.clinic.services;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.example.clinic.dto.CompanyDTO;
import org.example.clinic.model.Company;
import org.example.clinic.repo.CompanyRepository;
import org.example.clinic.repo.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CompanyService {

    private static final Logger logger = LogManager.getLogger(CompanyService.class);

    private final CompanyRepository companyRepository;
    private final ReservationRepository reservationRepository;

    @Autowired
    public CompanyService(CompanyRepository companyRepository, ReservationRepository reservationRepository) {
        this.companyRepository = companyRepository;
        this.reservationRepository = reservationRepository;
        logger.info("CompanyService initialized");
    }

    public List<CompanyDTO> getAllCompanies() {
        logger.trace("Getting all companies");
        try {
            return companyRepository.findAll().stream()
                    .map(this::toDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("Error getting all companies", e);
            throw e;
        }
    }

    public List<CompanyDTO> getActiveCompanies() {
        logger.trace("Getting all active companies");
        try {
            return companyRepository.findByIsActiveTrue().stream()
                    .map(this::toDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("Error getting active companies", e);
            throw e;
        }
    }

    public CompanyDTO findById(Long id) {
        logger.trace("Finding company by ID: {}", id);
        try {
            Company company = companyRepository.findById(id)
                    .orElseThrow(() -> {
                        logger.warn("Company not found with ID: {}", id);
                        return new ResponseStatusException(HttpStatus.NOT_FOUND,
                                "❌ Company not found with ID " + id);
                    });
            return toDTO(company);
        } catch (Exception e) {
            logger.error("Error finding company by ID: {}", id, e);
            throw e;
        }
    }

    public CompanyDTO saveOrUpdateCompany(CompanyDTO companyDTO) {
        logger.trace("Saving/updating company: {}", companyDTO);
        
        Company company;
        boolean isNew = (companyDTO.getId() == null || companyDTO.getId() == 0);
        
        if (isNew) {
            logger.debug("Creating new company: {}", companyDTO.getName());
            if (companyRepository.existsByName(companyDTO.getName())) {
                logger.warn("Attempt to create company with existing name: {}", companyDTO.getName());
                throw new ResponseStatusException(HttpStatus.CONFLICT,
                        "❌ A company with name " + companyDTO.getName() + " already exists.");
            }
            company = new Company();
        } else {
            logger.debug("Updating existing company: ID={}", companyDTO.getId());
            company = companyRepository.findById(companyDTO.getId())
                    .orElseThrow(() -> {
                        logger.error("Company not found for update: ID={}", companyDTO.getId());
                        return new ResponseStatusException(HttpStatus.NOT_FOUND,
                                "❌ Company not found with ID " + companyDTO.getId());
                    });
        }

        company.setName(companyDTO.getName());
        company.setDescription(companyDTO.getDescription());
        company.setEmail(companyDTO.getEmail());
        company.setPhone(companyDTO.getPhone());
        company.setAddress(companyDTO.getAddress());
        company.setContractStartDate(companyDTO.getContractStartDate());
        company.setContractEndDate(companyDTO.getContractEndDate());
        company.setIsActive(companyDTO.getIsActive());
        company.setPapersDeadlineDays(companyDTO.getPapersDeadlineDays() != null ? 
                companyDTO.getPapersDeadlineDays() : 30);

        Company saved = companyRepository.save(company);
        logger.info("Company {} successfully: ID={}, Name={}", 
                isNew ? "created" : "updated", saved.getId(), saved.getName());
        
        return toDTO(saved);
    }

    public void deleteById(Long id) {
        logger.trace("Deleting company by ID: {}", id);
        try {
            if (!companyRepository.existsById(id)) {
                logger.warn("Attempt to delete non-existent company: ID={}", id);
                throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "❌ Company not found with ID " + id);
            }
            companyRepository.deleteById(id);
            logger.info("Company deleted successfully: ID={}", id);
        } catch (Exception e) {
            logger.error("Error deleting company by ID: {}", id, e);
            throw e;
        }
    }

    public CompanyDTO getCompanyWithStatistics(Long id, LocalDate startDate, LocalDate endDate) {
        logger.trace("Getting company statistics: ID={}, StartDate={}, EndDate={}", id, startDate, endDate);
        
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "❌ Company not found with ID " + id));

        CompanyDTO dto = toDTO(company);
        
        // Get total patients for this company in date range
        if (startDate != null && endDate != null) {
            Long totalPatients = reservationRepository.countByCompanyAndDateBetween(company, startDate, endDate);
            dto.setTotalPatients(totalPatients);
        } else {
            Long totalPatients = reservationRepository.countByCompany(company);
            dto.setTotalPatients(totalPatients);
        }

        // Get patients needing papers (reservations within deadline that haven't sent papers)
        LocalDate deadlineDate = LocalDate.now().minusDays(company.getPapersDeadlineDays());
        Long patientsNeedingPapers = reservationRepository.countByCompanyAndPapersSentFalseAndDateAfter(company, deadlineDate);
        dto.setPatientsNeedingPapers(patientsNeedingPapers);

        logger.debug("Company statistics - ID={}, TotalPatients={}, PatientsNeedingPapers={}", 
                id, dto.getTotalPatients(), dto.getPatientsNeedingPapers());
        
        return dto;
    }

    private CompanyDTO toDTO(Company company) {
        CompanyDTO dto = new CompanyDTO();
        dto.setId(company.getId());
        dto.setName(company.getName());
        dto.setDescription(company.getDescription());
        dto.setEmail(company.getEmail());
        dto.setPhone(company.getPhone());
        dto.setAddress(company.getAddress());
        dto.setContractStartDate(company.getContractStartDate());
        dto.setContractEndDate(company.getContractEndDate());
        dto.setIsActive(company.getIsActive());
        dto.setPapersDeadlineDays(company.getPapersDeadlineDays());
        return dto;
    }
}
