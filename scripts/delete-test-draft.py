import sqlite3
c = sqlite3.connect("/var/www/henghui/prisma/dev.db")
c.execute("DELETE FROM BlogPost WHERE slug=?", ("cf-health-check-delete-me",))
c.commit()
print("deleted", c.total_changes)
