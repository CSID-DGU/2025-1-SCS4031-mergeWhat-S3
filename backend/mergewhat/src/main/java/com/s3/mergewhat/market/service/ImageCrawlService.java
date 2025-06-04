package com.s3.mergewhat.market.service;

import com.s3.mergewhat.market.domain.aggregate.entity.Entertainment;
import com.s3.mergewhat.market.domain.repository.EntertainmentRepository;
import io.github.bonigarcia.wdm.WebDriverManager;
import lombok.RequiredArgsConstructor;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class ImageCrawlService {
    private final EntertainmentRepository entertainmentRepository;

    public String getOrCrawlImage(Long marketId, String name, Boolean isIndoor) {
        return entertainmentRepository.findByMarketIdAndNameAndIsIndoor(marketId, name, isIndoor)
                .map(ent -> {
                    if (ent.getImageUrl() != null) {
                        return ent.getImageUrl();
                    }
                    String imageUrl = crawlImageFromNaver(name);
                    if (imageUrl != null) {
                        ent.setImageUrl(imageUrl);
                        entertainmentRepository.save(ent);
                    }
                    return imageUrl;
                })
                .orElseGet(() -> {
                    String imageUrl = crawlImageFromNaver(name);
                    if (imageUrl != null) {
                        Entertainment newEnt = new Entertainment();
                        newEnt.setMarketId(marketId);
                        newEnt.setName(name);
                        newEnt.setIsIndoor(isIndoor);
                        newEnt.setImageUrl(imageUrl);
                        entertainmentRepository.save(newEnt);
                    }
                    return imageUrl;
                });
    }

    private String crawlImageFromNaver(String keyword) {
        WebDriver driver = null;
        try {
            WebDriverManager.chromedriver().setup();

            ChromeOptions options = new ChromeOptions();
            options.addArguments("--headless", "--no-sandbox", "--disable-dev-shm-usage");
            driver = new ChromeDriver(options);

            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(15));
            driver.get("https://www.naver.com");

            WebElement searchBox = wait.until(ExpectedConditions.presenceOfElementLocated(By.id("query")));
            searchBox.sendKeys(keyword);
            searchBox.sendKeys(Keys.RETURN);

            WebElement imageTab = wait.until(ExpectedConditions.elementToBeClickable(By.linkText("이미지")));
            imageTab.click();

            WebElement firstImage = wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath(
                    "//*[@id='main_pack']/section/div[1]/div/div/div[1]/div[1]/div/div/div/img"
            )));

            return firstImage.getAttribute("src");
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        } finally {
            if (driver != null) driver.quit();
        }
    }
}
